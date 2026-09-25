---
title: "DeliveryGym: An RL Environment for Long-Horizon Embodied Agent Planning with Adaptive Curriculum"
collection: publications
category: preprints
status: preprint
permalink: /publication/2026-deliverygym
excerpt: 'Preprint, September 2026. arXiv:2609.19801.'
date: 2026-09-01
venue: 'arXiv'
paperurl: 'https://arxiv.org/abs/2609.19801'
codeurl: 'https://github.com/mk322/DeliveryGym'
citation: 'Haoqiang Kang, Yiming Zhang, Yiyang Guo, Chuying Li, Jianzhi Shen, Tianruo Rose Xu, Xiaokang Ye, Lianhui Qin. DeliveryGym: An RL Environment for Long-Horizon Embodied Agent Planning with Adaptive Curriculum. arXiv preprint arXiv:2609.19801, September 2026.'
share: false
hide_auto_published: true
show_paper_link: true
author_profile: true
---

## Abstract

Executable environments enable LLM agents to learn from the consequences of their actions. For embodied agents, those consequences extend beyond whether the current task succeeds: completing a delivery can consume the time, energy, or money needed for later work. Learning to plan therefore requires environments that preserve these dependencies and turn them into feedback across a complete trajectory.

We introduce DeliveryGym, a 3D environment for evaluating and training agents on continuous courier shifts. It couples multimodal tool interaction with persistent world dynamics and computes trajectory rewards from simulator events, making the costs of an agent's decisions available for reinforcement learning (RL). The environment also adapts future training shifts to the policy's observed weaknesses while keeping evaluation fixed.

Across six models and 13 city maps, evaluation exposes a gap between reliably executing assigned deliveries and choosing and sequencing work over a shift. On the unseen-city test set, RL improves Qwen3-VL-4B's net income by 54.3%, showing that learning from complete shifts improves performance under these coupled constraints. Adapting the training environment improves evaluation income by 18% over uniform sampling at 100 updates, indicating that which situations an agent practices also matters.

DeliveryGym provides an executable setting for studying how agents learn to coordinate deliveries and preserve resources for later orders within an episode.

Abstract from [arXiv:2609.19801v2](https://arxiv.org/abs/2609.19801v2), licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

[Code](https://github.com/mk322/DeliveryGym)
