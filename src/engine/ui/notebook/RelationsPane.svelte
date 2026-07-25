<script lang="ts">
  import { useStores } from '../../stores';
  import { buildRelationMap } from '../../map/relationMap';
  import { heroRubyHtml } from '../../hero';

  const { work, save } = useStores();
  const rels = work.relations!;
  const heroRuby = heroRubyHtml(work);
  const total = rels.edges.length;
  const collected = $derived(new Set(save.active?.cards ?? []));
  const got = $derived(rels.edges.filter((e) => collected.has(e.pid)).length);
  const svg = $derived(buildRelationMap(work, collected));
</script>

<div class="tabpane active" id="pane-relations">
  <div class="collect-bar">
    <div class="collect-meter"><i style="width:{Math.round((got / total) * 100)}%"></i></div>
    <span class="collect-count">{got}/{total} の 関係</span>
  </div>
  <p class="rel-lead">
    {@html heroRuby}を 中心に、出会った 人との つながり。カードを 集めるほど、線が つながっていく。
  </p>
  <div class="relmap-wrap">{@html svg}</div>
  <div class="rel-legend">
    {#each rels.cats as c (c.key)}
      <span class="rel-chip"><i style="background:{c.color}"></i>{@html c.label}</span>
    {/each}
  </div>
</div>
