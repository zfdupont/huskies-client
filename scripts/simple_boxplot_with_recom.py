import matplotlib.pyplot as plt
from gerrychain import (GeographicPartition, Partition, Graph, MarkovChain,
                        proposals, updaters, constraints, accept, Election)
from gerrychain.proposals import recom
from gerrychain.constraints import contiguous
from gerrychain.updaters import Tally
from functools import partial
import geopandas as gpd
import pandas
import matplotlib.pyplot as plt
import numpy as np
gdf = gpd.read_file('./mergedGA.geojson')
graph = Graph.from_geodataframe(gdf)
elections = [Election("PRE20", {"Democratic": "2020VBIDEN", "Republican": "2020VTRUMP"})]
my_updaters = {"population": updaters.Tally("POPTOT", alias="population"),"black_vap": updaters.Tally("VAPBLACK", alias="black_vap"),"total_vap": updaters.Tally("VAPTOTAL", alias="total_vap")}
election_updaters = {election.name: election for election in elections}
my_updaters.update(election_updaters)
initial_partition = GeographicPartition(graph, assignment="district_id", updaters=my_updaters)

ideal_population = sum(initial_partition["population"].values()) / len(initial_partition)
proposal = partial(recom,
                   pop_col="POPTOT",
                   pop_target=ideal_population,
                   epsilon=0.02,
                   node_repeats=2
                  )

compactness_bound = constraints.UpperBound(
    lambda p: len(p["cut_edges"]),
    2*len(initial_partition["cut_edges"])
)

pop_constraint = constraints.within_percent_of_ideal_population(initial_partition, 0.02)
chain = MarkovChain(
    proposal=proposal,
    constraints=[
        pop_constraint,
        compactness_bound
    ],
    accept=accept.always_accept,
    initial_state=initial_partition,
    total_steps=200
)
black_proportions = []
for i in range(14):
  black_proportions.append([])

for partition in chain:
  a = []
  for district in partition["black_vap"]:
      a.append(partition["black_vap"][district] * 100 / partition["total_vap"][district])
  a = sorted(a)
  for x in range(len(a)):
    black_proportions[x].append(a[x])
black_proportions = sorted(black_proportions, key=lambda x: sum(x)/len(x))
sorted_data = sorted(black_proportions, key=lambda x:np.median(x))
plt.boxplot(sorted_data,showfliers=False)


plt.xlabel("Districts")
plt.ylabel("Black population(%)")
plt.title("Black population distributions from a Gerrychain Markov chain")


plt.show()