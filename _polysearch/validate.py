"""Audit the entire public PolySearch tree and its link targets before publication."""
import argparse,json,re,hashlib
from pathlib import Path
from html.parser import HTMLParser
class HTML(HTMLParser):
    def __init__(self):super().__init__();self.ids=set();self.refs=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.add(a['id'])
        for key in ['src','href']:
            if key in a:self.refs.append(a[key])
def validate(root):
    files=[p for p in root.rglob('*') if p.is_file()]
    allowed={'.html','.css','.js','.json'}
    denied=re.compile(r'/Users/[A-Za-z]|/home/[A-Za-z]|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}|github_pat_[A-Za-z0-9_]+|gh[pousr]_[A-Za-z0-9]+|sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY|"(?:actual_submitted_prompt|raw_output|reference_evidence|cookie|password|access_token|session_id)"\s*:')
    for p in files:
        assert not p.is_symlink(), 'Symlink disallowed'
        assert p.suffix in allowed, 'Unapproved asset: '+p.name
        text=p.read_text();assert not denied.search(text),'Privacy/security pattern in '+p.name
        assert 'sourceMappingURL' not in text,'Source map reference disallowed'
    h=HTML();h.feed((root/'index.html').read_text())
    for ref in h.refs:
        if ref.startswith('#'):assert ref[1:] in h.ids,'Broken anchor '+ref
        elif not ref.startswith(('https://','http://')):assert (root/ref).is_file(),'Missing asset '+ref
    d=json.loads((root/'data/pilot-results.json').read_text());p=json.loads((root/'data/provenance.json').read_text());rows=d['observations']
    assert len(rows)==d['counts']['attempts']==8
    assert sum(r['status']=='passed' for r in rows)==d['counts']['all_essential_pass']==4
    assert sum(r['status']=='contract' for r in rows)==d['counts']['contract_failures']==2
    assert sum(r['status']=='blocked' for r in rows)==d['counts']['quota_blocks']==2
    assert d['replication']['executed']==0 and d['replication']['planned']==16
    assert len(d['replication']['days'])==4
    assert 'human audit pending' in d['review_status']
    for r in rows:
        assert r['output_excerpt'] is None and r['screenshot'] is None
        assert re.fullmatch('[0-9a-f]{64}',r['raw_sha256'])
        if r['status']=='blocked':assert all(a['score'] is None for a in r['atoms']) and all(v is None for v in r['dimensions'].values())
    assert p['screenshots_included']==[] and len(p['screenshots_excluded'])==8
    print(json.dumps({'status':'passed','public_files':len(files),'bytes':sum(x.stat().st_size for x in files),'internal_links':'passed','counts_and_nulls':'passed','privacy_patterns':'passed','third_party_assets_published':0},indent=2))
if __name__=='__main__':
    a=argparse.ArgumentParser();a.add_argument('root',type=Path,nargs='?',default=Path('PolySearch'));validate(a.parse_args().root)
