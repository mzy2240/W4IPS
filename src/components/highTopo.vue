<template>
  <div
    id="testTopo"
    class="orangetest"
  >
  </div>
</template>

<script>
require('../../static/utils/core/ht.js');
export default {
	data() {
		return {};
	},
	methods: {
		init() {
			var gv = new ht.graph.GraphView();
			var node = new ht.Node();
			node.setPosition(20, 20);
			node.setName('node');

			gv.getDataModel().add(node);

			var view = gv.getView();
			view.className = 'topo';
			var parent = document.getElementById('testTopo');
			console.log(parent);
			parent.appendChild(view);

			gv.addBottomPainter(function(g) {
				var viewRect = gv.getViewRect();
				var zoom = gv.getZoom();

				var startX = viewRect.x;
				var endX = startX + viewRect.width;
				var startY = viewRect.y;
				var endY = startY + viewRect.height;

				g.save();
				g.beginPath();
				g.fillStyle = '#ddd';
				for (var i = startX, ii = 0; i < endX; i += 10 / zoom, ii++) {
					for (var j = startY, jj = 0; j < endY; j += 10 / zoom, jj++) {
						if ((ii % 2 != 0 && jj % 2 != 0) || (ii % 2 == 0 && jj % 2 == 0)) {
							g.rect(i, j, 10 / zoom, 10 / zoom);
						}
					}
				}
				g.fill();

				g.restore();
			});
			console.log('Finish rendering');
		}
	},
	created() {},
	mounted() {
		this.init();
	}
};
</script>

<style>
.topo {
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	/* height: 200px;
	width: 100%; */
}
.orangetest {
	height: 300px;
	width: 100%;
	background-color: rgb(218, 105, 22);
}
</style>
