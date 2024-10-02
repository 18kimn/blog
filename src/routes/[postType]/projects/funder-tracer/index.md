---
title: CLI tool to help trace DoD grants to your university
date: 2024-10-02
---

I worked on a bunch of stuff tracing money to and from
universities this past year. Most of that focuses on the
University of Michigan endowment, but I also spoke at a
[workshop](https://x.com/cellllla/status/1833601066522304800)
a few friends and I hosted a few weeks ago. I prepared and
demo'ed a CLI tool to aggregate grants data from the
[Defense Tech Information Center](https://dtic.dimensions.ai/).
Obviously very simple, it doesn't even have a name. But it
might be useful for you?

You can access it
[here](https://github.com/18kimn/funder-tracer). Here's a
short preview of what its usage looks like:

```sh
/home/nathan/Downloads: ./dtic
Your university: Berkeley
1) University of California, Berkeley
2) Lawrence Berkeley National Laboratory
3) Berkeley Geochronology Center
4) Berkeley City College
5) Tsinghua–Berkeley Shenzhen Institute
Please select a university (1-10), or type 0 to start over: 1
Got it, trying to fetch data for University of California, Berkeley now!

Fetching grants: 100%|██████████████████| 155/155 [00:07<00:00, 20.56grant/s]
Grabbing research fields for each grant: 100%|█| 155/155 [00:14<00:00, 10.81grant/s]

Success! Saved data to 'grants.csv' in this directory (/home/nathan/Downloads) :)
```

`grants.csv` then is a spreadsheet of grants recorded from
the Department of Defense to your university, with
abstracts, research fields, names of PIs, and other useful
information included.
