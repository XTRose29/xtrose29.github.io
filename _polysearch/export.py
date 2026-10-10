"""Fail-closed public export. Reads research SQLite in read-only mode; never copies raw records."""
import argparse, hashlib, json, re, sqlite3
from pathlib import Path

def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(p): return json.loads(Path(p).read_text())
def require(ok, message):
    if not ok: raise ValueError(message)
def db(p):
    c=sqlite3.connect(p.resolve().as_uri()+'?mode=ro',uri=True); c.row_factory=sqlite3.Row; return c

def export(research, dest):
    root=research/'output/academic_feasibility_v1'; manifest=load(root/'manifest.json'); identity=load(root/'identity.json')
    canonical=json.dumps(manifest,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()
    require(hashlib.sha256(canonical).hexdigest()==identity['manifest_hash'],'Manifest identity mismatch')
    for s in manifest['sources']:
        for field in ['pdf','text','content']:
            require(sha(root/s[field])==s[field+'_sha256'],'Frozen source changed')
    report=load(root/'feasibility_result_20261010.json')
    require(report['manifest_hash']==identity['manifest_hash'],'Report identity mismatch')
    c=db(root/'evidence.sqlite3'); obs=c.execute('select * from behavior_observations where run_id=?',(identity['run_id'],)).fetchall()
    require(len(obs)==8 and len(report['results'])==8,'Pilot count mismatch')
    require({(o['tool_id'],o['task_id']) for o in obs}=={(t,q) for t in ['chatpdf:web','scispace:web'] for q in ['PU-1','PU-2','CG-1','CG-2']},'Unexpected task/tool pool')
    labels={'datasets':'Dataset identification','metric':'Metric attribution','grounding':'Grounding','format':'Output contract','systems':'System identification','architectures':'Architecture attribution','composition':'Model composition','schema':'Strict JSON schema','polarity':'Claim judgment','evidence':'Evidence support','explanation':'Source-consistent explanation','length':'Explanation length','abstention':'Literal abstention contract','sources':'Source coverage'}
    rows=[]; excluded=[]
    for o in obs:
        rawpath=Path(o['raw_ref']); require(sha(rawpath)==o['raw_sha256'],'Raw hash mismatch'); raw=load(rawpath); cap=raw['capture']
        require(cap['run_id']==identity['run_id'] and cap['manifest_hash']==identity['manifest_hash'],'Capture identity mismatch')
        task=next(t for t in manifest['tasks'] if t['task_id']==o['task_id'])
        require(cap['source_hashes']==task['source_hashes'],'Uploaded source hash mismatch')
        require(set(cap['uploaded_source_ids'])==set(task['source_ids']),'Uploaded source set mismatch')
        require(cap['requested_prompt']==task['exact_prompt'] and cap['actual_submitted_prompt']==task['exact_prompt'],'Prompt mismatch')
        require(cap['fresh_session'] and not cap['answer_repair'] and cap['retry_count']==0,'Execution protocol mismatch')
        require(raw['output']==cap['raw_output'],'Output mismatch')
        for a in raw['frozen_artifacts']: require(sha(a['path'])==a['sha256'],'Evidence artifact changed')
        r=next(r for r in report['results'] if r['observation_id']==o['observation_id'])
        require(r['raw_sha256']==o['raw_sha256'] and r['operational_status']==o['execution_status'],'Report/observation mismatch')
        require(hashlib.sha256(cap['raw_output'].encode()).hexdigest()==r['raw_output_sha256'],'Answer hash mismatch')
        js=c.execute('select payload_json from behavior_judgments where observation_id=? and evaluator_version=?',(o['observation_id'],report['selected_evaluator_version'])).fetchall()
        require(len(js)==1,'Missing independent judgment'); judgment=json.loads(js[0][0])
        require(judgment['atomic_scores']==r['atomic_scores'],'Judgment/report mismatch')
        require(judgment['dimensions']==r['dimensions'] and judgment['raw_sha256']==r['raw_sha256'],'Dimension/provenance mismatch')
        require({a['item_id'] for a in r['atomic_scores']}=={a['item_id'] for a in task['essential_rubric']},'Rubric identity mismatch')
        atoms=[{'name':labels[a['item_id'].split(':')[1]],'score':a['score']} for a in r['atomic_scores']]
        require(all(a['score'] in [0,1,None] for a in atoms),'Invalid atom')
        received=o['execution_status']=='output_received'
        require(r['completion']==(all(a['score']==1 for a in atoms) if received else None),'Completion/atom mismatch')
        require((sum(a['score'] for a in atoms)==r['passed_items']) if received else all(a['score'] is None for a in atoms),'Score consistency')
        dims={k:(v.get('score',v.get('value')) if isinstance(v,dict) else None) for k,v in r['dimensions'].items()}
        public_id=o['tool_id'].split(':')[0]+'-'+o['task_id']
        row={'id':public_id,'tool':o['tool_id'],'task':o['task_id'],'date':o['executed_at'],'operational':o['execution_status'],'status':'passed' if r['completion'] is True else 'contract' if received else 'blocked','atoms':atoms,'dimensions':dims,'latency_ms':None,'timing_note':'Service latency unavailable; manual observation intervals include capture and operator delays.','effort':'One prompt paste and one submit; total operator effort not fully measured. No retry or repair.','raw_sha256':o['raw_sha256'],'output_excerpt':None,'screenshot':None,'evidence_notice':'Raw text and screenshots retained privately. Public redistribution permission for third-party response/UI content is not established; no substitute image is shown.'}
        rows.append(row)
        for a in raw['frozen_artifacts']:
            if Path(a['path']).suffix.lower()=='.png': excluded.append({'observation':public_id,'captured_during':o['executed_at'][:10],'sha256':a['sha256'],'decision':'not_published','reason':'Redistribution permission not established. Original capture retained; exact screenshot time unavailable.'})
    c.close()
    require(sum(r['operational']=='output_received' for r in rows)==6,'Output count')
    require(sum(r['status']=='blocked' for r in rows)==2,'Block count')
    require(sum(r['status']=='contract' for r in rows)==2,'Contract count')
    plan=load(research/'config/academic_balanced_replication_v1/protocol.json'); progress=[]
    for key,run in plan['storage_and_import']['replication_runs'].items():
        rc=db(research/run['package']/'evidence.sqlite3')
        n=rc.execute('select count(*) from behavior_observations where run_id=?',(run['run_id'],)).fetchone()[0]; rc.close();progress.append(n)
    require(sum(progress)==0,'New replication evidence requires independent grading and an explicit public export review; do not publish automatically')
    data={'schema':'polysearch-public-v1','as_of':report['recorded_at'],'review_status':'Preliminary independent blinded AI judgments; human audit pending. Not final scientific findings.','counts':{'attempts':len(rows),'answers':6,'quota_blocks':2,'contract_failures':2,'all_essential_pass':4},'observations':sorted(rows,key=lambda x:(x['tool'],x['task'])),'replication':{'executed':sum(progress),'planned':len(plan['schedule']),'days':[{'date':date,'repetition':next(r['replication'] for r in plan['schedule'] if r['planned_date']==date),'tasks':list(dict.fromkeys(r['task_id'] for r in plan['schedule'] if r['planned_date']==date)),'state':'not_executed'} for date in plan['calendar']['nominal_dates']],'time':'16:00 America/New_York','note':'Verified static evidence snapshot; no live connection and no automatic collection.'}}
    provenance={'schema':'polysearch-provenance-v1','as_of':data['as_of'],'manifest_sha256':identity['manifest_hash'],'report_sha256':sha(root/'feasibility_result_20261010.json'),'protocol_sha256':sha(research/'config/academic_balanced_replication_v1/protocol.json'),'source_hashes':[{'source':s['source_id'],'dataset':s['dataset'],'pdf_sha256':s['pdf_sha256']} for s in manifest['sources']],'judgment_version':report['selected_evaluator_version'],'review_status':data['review_status'],'export_policy':'Allowlisted measurements only. No prompts, gold answers, grading rationales, source text, account details, private paths, session identifiers, raw transcripts or databases.','screenshots_included':[],'screenshots_excluded':excluded,'sources_for_figures':{'pilot_matrix':'Eight immutable pilot observations joined to versioned independent judgments','status_chart':'Operational status of those eight observations','dimension_chart':'Dimension annotations in the verified pilot report; denominators exclude missing outputs','replication_timeline':'Frozen schedule joined to read-only observation counts'},'rights_review':'Only study-authored descriptive text, numerical observations and original diagrams published. Tool UI screenshots and response transcripts withheld; benchmark papers/datasets linked rather than redistributed.'}
    for obj in [data,provenance]:
        txt=json.dumps(obj,ensure_ascii=False)
        require(not re.search(r'/Users/|/home/|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}|github_pat_|ghp_|sk-[A-Za-z0-9]{16}|BEGIN .*PRIVATE KEY',txt),'Public privacy scan failed')
    dest.mkdir(parents=True,exist_ok=True)
    for name,obj in [('pilot-results',data),('provenance',provenance)]:
        content=json.dumps(obj,ensure_ascii=False,indent=2)+'\n'; digest=hashlib.sha256(content.encode()).hexdigest()[:12]
        archive=dest/'snapshots'/f'{name}-{digest}.json';archive.parent.mkdir(exist_ok=True)
        if archive.exists(): require(archive.read_text()==content,'Snapshot collision')
        else: archive.write_text(content)
        (dest/(name+'.json')).write_text(content)
    print('Verified export: 8 attempts, 6 answers, 2 quota blocks; replication 0/16; no raw content published.')

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--research-root',type=Path,required=True);p.add_argument('--out',type=Path,default=Path('PolySearch/data'));a=p.parse_args();export(a.research_root,a.out)
