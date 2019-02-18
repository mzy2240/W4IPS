!function(_,r){"use strict";var x="ht",s=x+".graph.",O=_[x],B=O.graph,J=O.Default,A=O.Color,G=null,v="px",Z=J.getInternal(),N=Z.getPinchDist,d=J.preventDefault,U=J.getTouchCount,y=J.startDragging;Z.addMethod(J,{overviewBackground:A.widgetBackground,overviewMaskBackground:A.transparent,overviewContentBorderColor:A.widgetBorder,overviewContentBackground:A.background},!0),B.Overview=function(x){var l=this,t=l._view=Z.createView(1,l);l._canvas=Z.createCanvas(t),t.style.background=J.overviewBackground,t.appendChild(l._mask=Z.createDiv()),l.setGraphView(x),l.addListeners()},J.def(s+"Overview",r,{ms_v:1,ms_fire:1,ms_listener:1,ms_ac:["maskBackground","contentBorderColor","contentBackground","autoUpdate","fixToRect"],_autoUpdate:!0,_fixToRect:!1,_rate:1,_scrollRect:{x:0,y:0,width:0,height:0},_maskBackground:J.overviewMaskBackground,_contentBorderColor:J.overviewContentBorderColor,_contentBackground:J.overviewContentBackground,getGraphView:function(){return this.gv},setGraphView:function(H){var F=this;if(F.gv!==H){var d=F.gv;F.gv=H,d&&(d.removeViewListener(F.handleGraphViewChanged,F),d.ump(F.handleGraphViewPropertyChanged,F)),H&&(H.addViewListener(F.handleGraphViewChanged,F),H.mp(F.handleGraphViewPropertyChanged,F)),F.fp("graphView",d,H),F.redraw()}},getCanvas:function(){return this._canvas},getMask:function(){return this._mask},dispose:function(){this.setGraphView(null)},onPropertyChanged:function(){this.redraw()},handleGraphViewChanged:function(j){this._autoUpdate&&"validate"===j.kind&&this.redraw()},handleGraphViewPropertyChanged:function(Z){("canvasBackground"===Z.property||this.getFixToRect()&&("zoom"===Z.property||"translateX"===Z.property||"translateY"===Z.property))&&this.redraw()},redraw:function(){var x=this;x._redraw||(x._redraw=1,x.iv(50))},validateImpl:function(){var y=this,j=y.gv,Y=y._canvas,Q=y.getWidth(),t=y.getHeight(),C=y._redraw;if(j){var r=y._mask,f=r.style,a=j.getViewRect(),H=this.getFixToRect(),u=H?"boolean"==typeof H?j.getContentRect():H:j.getScrollRect(),E=u.x,P=u.y,T=u.width,q=u.height,D=y._rate=Math.max(T/Q,q/t),M=y._x=(Q-T/D)/2,h=y._y=(t-q/D)/2;if(0!==a.width&&0!==a.height||y.hasRetry||(J.callLater(y.iv,y,G),y.hasRetry=!0),(Q!==Y.clientWidth||t!==Y.clientHeight)&&(Z.setCanvas(Y,Q,t),C=1),Z.isSameRect(u,y._scrollRect)||(y._scrollRect=u,C=1),C){var i=Z.initContext(Y),A=j.getDataModel(),W=A.getBackground()||y._contentBackground,n=y._contentBorderColor,o=J.devicePixelRatio;i.clearRect(0,0,Q*o,t*o);var O=A.getBackground()&&A.a("width")>0&&A.a("height")>0;W&&!O&&Z.fillRect(i,M*o,h*o,T/D*o,q/D*o,W),Z.translateAndScale(i,-E/D+M,-P/D+h,1/D),j._42(i),i.restore(),n&&Z.drawBorder(i,n,M*o,h*o,T/D*o,q/D*o)}f.background=y._maskBackground,f.left=M+(a.x-E)/D+v,f.top=h+(a.y-P)/D+v,f.width=a.width/D+v,f.height=a.height/D+v,y._redraw=null}else if(C){var i=Z.initContext(Y);i.clearRect(0,0,Q,t),i.restore(),y._redraw=null}},center:function(H){var d=this,K=d.gv;if(K){var F=K._zoom,f=K._29I,M=d._rate,r=d._scrollRect,C=J.getLogicalPoint(H,d._canvas),G=r.x+(C.x-d._x)*M,Y=r.y+(C.y-d._y)*M;K.setTranslate((f.width/2-G)*F,(f.height/2-Y)*F)}},handle_mousedown:function(t){this.handle_touchstart(t)},handleWindowMouseUp:function(R){this.handleWindowTouchEnd(R)},handleWindowMouseMove:function(s){this.handleWindowTouchMove(s)},handle_mousewheel:function(r){this.handleScroll(r,r.wheelDelta)},handle_DOMMouseScroll:function(t){2===t.axis&&this.handleScroll(t,-t.detail)},handleScroll:function(e,_){if(d(e),this.gv){var C=this.gv;_>0?C.scrollZoomIn():0>_&&C.scrollZoomOut()}},handle_touchstart:function(n){if(d(n),this.gv&&J.isLeftButton(n)){var k=this,f=k.gv,g=U(n);1===g?J.isDoubleClick(n)&&f.isResettable()?f.reset():(k.center(n),y(k,n)):2===g&&(k._dist=N(n),y(k,n))}},handleWindowTouchEnd:function(){delete this._dist},handleWindowTouchMove:function(R){if(this.gv){var e=this,I=e._dist,X=U(R);1===X?e.center(R):2===X&&I!=G&&e.gv.handlePinch(G,N(R),I)}}})}("undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:(0,eval)("this"),Object);