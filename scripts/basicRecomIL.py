import matplotlib.pyplot as plt
from gerrychain import (GeographicPartition, Partition, Graph, MarkovChain,
                        proposals, updaters, constraints, accept, Election)
from gerrychain.proposals import recom
from functools import partial
import geopandas as gpd
import pandas

gdf = gpd.read_file('./mergedIL.geojson')
graph = Graph.from_geodataframe(gdf)
elections = [Election("PRE20", {"Democratic": "2020VBIDEN", "Republican": "2020VTRUMP"})]
my_updaters = {"population": updaters.Tally("POPTOT", alias="population")}
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
    total_steps=20
)

data = pandas.DataFrame(
    sorted(partition["PRE20"].percents("Democratic"))
    for partition in chain
)

fig, ax = plt.subplots(figsize=(8, 6))

# Draw 50% line
ax.axhline(0.5, color="#cccccc")

# Draw boxplot
data.boxplot(ax=ax, positions=range(len(data.columns)))

# Draw initial plan's Democratic vote %s (.iloc[0] gives the first row)
plt.plot(data.iloc[0], "ro")

# Annotate
ax.set_title("Comparing the 2021 plan to an ensemble")
ax.set_ylabel("Democratic vote % (President 2020)")
ax.set_xlabel("Sorted districts")
ax.set_ylim(0, 1)
ax.set_yticks([0, 0.25, 0.5, 0.75, 1])

plt.show()