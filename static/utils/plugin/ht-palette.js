!function(F,J,c){"use strict";var e="px",g="0",C="innerHTML",p="className",n=ht.Default,T=ht.Color,Z=ht.Node,v="position",D="top",y="left",X=n.animate,t=n.getInternal(),m="width",g="0",S="none",P="max-height",_="font",R="background",i="border-box",G="user-select",Y="box-sizing",k="overflow",s=n.isTouchable,t=n.getInternal(),j=T.titleIconBackground,q=n.scrollBarInteractiveSize,o=/msie 9/.test(F.navigator?F.navigator.userAgent.toLowerCase():""),f=null,B=function(){return document},H=function(v){return B().createElement(v)},z=function(){return H("div")},M=function(){var L=z(),y=L.style;return y.msTouchAction=S,y.cursor="default",s&&y.setProperty("-webkit-tap-highlight-color","rgba(0, 0, 0, 0)",f),y.position="absolute",y.left=g,y.top=g,L},h=function(){return H("canvas")},r=function(){return document.body},u=function(T,g,p){T.style.setProperty(g,p,f)},U=function(C,J){C.style.removeProperty(J)},A=function(y,u,v){n.def(ht.widget[y],u,v)},V=function(d,N){d.appendChild(N)},l=function(h,V){h.removeChild(V)},L=n.eventListenerOptionsFalse,Q=(n.eventListenerOptionsTrue,function(G,i,M,w){G.addEventListener(i,M,w?L:L)});t.addMethod(n,{paletteExpandIcon:{width:16,height:16,comps:[{type:"triangle",rect:[4,4,10,8],background:j,rotation:3.14}]},paletteCollapseIcon:{width:16,height:16,comps:[{type:"triangle",rect:[4,4,10,8],background:j}]},paletteTitleLabelColor:n.labelSelectColor,paletteTitleLabelFont:n.labelFont,paletteContentLabelFont:n.labelFont,paletteContentLabelColor:"#777",paletteContentBackground:"#fff",paletteTitleHeight:n.widgetTitleHeight,paletteTitleBackground:T.titleBackground,paletteTitleHoverBackground:T.titleBackground,paletteSeparatorWidth:1,paletteSeparatorColor:c,paletteItemHoverBorderColor:T.highlight,paletteItemSelectBackground:T.highlight},!0);var d=".palette-item:hover{border: 1px solid "+n.paletteItemHoverBorderColor+" !important}"+" .palette-header:hover{background: "+n.paletteTitleHoverBackground+" !important}",K=document.createElement("style");s||(K.styleSheet?K.styleSheet.cssText=d:K.appendChild(B().createTextNode(d))),B().getElementsByTagName("head")[0].appendChild(K);var b=function(f){var R=this;R.$22h=f,R.addListeners()};n.def(b,J,{ms_listener:1,getView:function(){return this.$22h.getView()},$26h:function(){var V=this;V.$36h&&r().removeChild(V.$36h),V.$23h=V.$24h=V.$25h=V.$35h=V.$36h=f},handle_touchstart:function(l){for(var d,C=this,G=C.$22h,A=l.target,D=G.sm(),j=G.dm(),Z="palette-header",S="palette-header-tool",V="palette-item",_=!1,g=!1,f=!1;A&&(A[p]||"").indexOf(Z)<0&&(A[p]||"").indexOf(V)<0;)A=A.parentNode;if(A&&A[p].indexOf(S)>=0?_=!0:A&&A[p].indexOf(Z)>=0?f=!0:A&&A[p].indexOf(V)>=0&&(g=!0),n.isLeftButton(l))if(C.$27h(l))C.$24h=n.getClientPoint(l),C.$25h=G.ty();else if(_){n.preventDefault(l),d=A.parentNode.$11h;var K=j.getDataById(d),X=K.s("tools")[A.toolIndex];X.action&&X.action.call(G)}else if(f){n.preventDefault(l),d=A.$11h;var K=j.getDataById(d);K.isExpanded()?K.setExpanded(!1):K.setExpanded(!0)}else if(g){d=A.$11h;var Y=j.getDataById(d);D.ss(Y),G.handleDragAndDrop&&(n.preventDefault(l),Y.s("draggable")&&(G.handleDragAndDrop(l,"prepare"),C.$35h=0)),Y.s("draggable")||(n.preventDefault(l),C.$24h=n.getClientPoint(l),C.$25h=G.ty())}else n.preventDefault(l),C.$24h=n.getClientPoint(l),C.$25h=G.ty();else C.$26h(l)},handle_mousedown:function(D){this.handle_touchstart(D)},handle_mousewheel:function(S){this.handleScroll(S,S.wheelDelta/40,S.wheelDelta!==S.wheelDeltaX)},handle_DOMMouseScroll:function(o){this.handleScroll(o,-o.detail,1)},handleScroll:function(B,A,G){var d=this.$22h;n.preventDefault(B),G&&d._41o()&&d.ty(d.ty()+20*A)},handle_mouseup:function(b){this.handle_touchend(b)},handle_touchend:function(R){var r=this;r.$37h(R),r.$26h(R)},handleWindowMouseUp:function(e){this.handleWindowTouchEnd(e)},handleWindowTouchEnd:function(u){var d=this;d.$37h(u),d.$26h(u)},$37h:function(J){var Y=this,w=Y.$22h;2===Y.$35h&&(Y.$35h=3,w.handleDragAndDrop(J,"end"))},handleWindowMouseMove:function(U){this.handleWindowTouchMove(U)},handleWindowTouchMove:function(d){var y=this,A=y.$22h,z=y.$23h,t=y.$24h,V=y.$25h,Q=n.getClientPoint(d),w=A._29I,K=y.$36h;if(1===y.$35h||2===y.$35h){if(y.$35h=2,A.handleDragAndDrop(d,"between"),s){var H=d.touches[0];d=H?H:d.changedTouches[0]}K.style.left=d.pageX-parseInt(K.width)/2+e,K.style.top=d.pageY-parseInt(K.height)/2+e}else"p"===z?A.ty(V+Q.y-t.y):"v"===z&&A.ty(V+(t.y-Q.y)/w.height*A._59I)},handle_mousemove:function(X){this.handle_touchmove(X)},handle_touchmove:function(P){if(!n.isDragging()&&n.isLeftButton(P)){var J=this,Y=J.$22h,$=J.$27h(P);if(J.$24h){if(!J.$23h){if(n.getDistance(n.getClientPoint(P),J.$24h)<2)return;J.$23h=$?"v":"p",n.startDragging(J)}}else if($)Y._43o();else if(0===J.$35h){if(J.$35h=1,Y.handleDragAndDrop(P,"begin"),s){var W=P.touches[0];P=W?W:P.changedTouches[0]}var m=J.$36h=new Image,C=Y.$10h[Y.sm().ld().getId()].querySelector(".image-box"),b=parseInt(C.style.width),o=parseInt(C.style.height);m.draggable=!1,m.src=C.toDataURL(),m.width=b,m.height=o,m.style.position="absolute",m.style.left=P.pageX-b/2+e,m.style.top=P.pageY-o/2+e,r().appendChild(m),n.startDragging(J)}}},$27h:function(M){var T=this.$22h,x=T.getView(),K=x.getBoundingClientRect(),B=T._29I,Q=M.clientX-K.left+x.scrollLeft;return T._41o()&&B.x+B.width-Q<q}}),ht.widget.Palette=function(l){var g=this,z=g._view=t.createView(null,g);g.$9h={},g.$10h={},g.$4h={},g._29I={x:0,y:0,width:0,height:0},g._59I=0,g.dm(l?l:new ht.DataModel),z[p]="ht-widget-palette",g.$29h=new b(g),u(z,R,n.paletteContentBackground),u(z,k,"auto"),u(z,Y,i),u(z,"-moz-"+Y,i),u(z,"-webkit-"+G,S),u(z,"-moz-"+G,S),u(z,"-ms-"+G,S),u(z,G,S),u(z,"position","absolute"),u(z,"overflow","hidden"),V(z,g._79O=M()),Q(z,"dragstart",function(I){I.dataTransfer&&(I.dataTransfer.setData("Text","nodeid:"+I.target.$11h),I.dataTransfer.effectAllowed="all",g.$29h.$26h())})},A("Palette",J,{ms_v:1,ms_fire:1,ms_dm:1,ms_sm:1,ms_vs:1,ms_ac:["itemImageWidth","itemImageHeight","itemImagePadding","itemMargin","layout","autoHideScrollBar","scrollBarSize","scrollBarColor"],$30h:0,_itemImagePadding:4,_itemImageWidth:70,_itemImageHeight:50,_itemMargin:10,_layout:"largeicons",_autoHideScrollBar:n.autoHideScrollBar,_scrollBarSize:n.scrollBarSize,_scrollBarColor:n.scrollBarColor,getViewRect:function(){return this._29I},ty:function(w){return w==f?this.getTranslateY():(this.setTranslateY(w),void 0)},setTranslateY:function(E){if(this.$32h==f){var z=this,W=z.$33h(E),j=z.$30h;z.$30h=W,z.fp("translateY",j,W)}},getTranslateY:function(){return this.$30h},setLayout:function(q){var m,U,B=this,h=B._layout;B._layout=q,"smallicons"===q?m=U=20:"iconsonly"===q?m=U=50:(m=70,U=50),B.setItemImageWidth(m),B.setItemImageHeight(U),B.setItemImagePadding(4),B.fp("layout",h,q)},getDataAt:function(i){for(var c=i.target;c&&c.$11h==f;)c=c.parentNode;return c&&c.$11h!=f?this.getDataModel().getDataById(c.$11h):void 0},$20h:function(){var z=16;return s&&(z*=1.2),z},$19h:function(){return n.paletteTitleHeight},$18h:function(){var W=n.paletteSeparatorWidth,v=n.paletteTitleBackground,x=n.paletteSeparatorColor||n.brighter(v);return W+e+" solid "+x},$17h:function(n){u(n,"cursor","pointer"),u(n,"display","inline-block"),u(n,"margin-right",(s?8:4)+e),u(n,"vertical-align",D)},$1h:function(U){var l=this,o=z(),M=z(),b=H("span");o[p]="palette-header",u(o,v,"relative"),u(o,R,n.paletteTitleBackground),u(o,"color",n.paletteTitleLabelColor),u(o,D,g),u(o,Y,i),u(o,"-moz-"+Y,i),u(o,"padding","0 5px 0 0"),u(o,"border-top",l.$18h()),u(o,m,"100%"),u(o,"cursor","pointer"),u(o,"white-space","nowrap"),u(o,k,"hidden"),u(o,_,n.paletteTitleLabelFont),u(o,"line-height",l.$19h()+e),o.$11h=U.getId();var y=h(),F=l.$19h(),P=l.$20h();l.$17h(y),t.setCanvas(y,P,F),V(o,y);var Z=U.s("tools");if(Z)for(var c=0;c<Z.length;c++){var E=h();l.$17h(E),t.setCanvas(E,P,F),E[p]="palette-header-tool palette-header-tool"+U.getId()+"-"+c,E.style.position="absolute",E.style.right=(P+10)*c+"px",E.toolIndex=c,V(o,E)}return y[p]="palette-toggle-icon-"+U.getId(),M[p]="palette-content",u(M,"max-height",0+e),u(M,_,n.paletteContentLabelFont),u(M,k,"hidden"),M.$11h=U.getId(),l.$9h[U.getId()]=M,b[C]=U.getName(),u(b,_,n.paletteTitleLabelFont),V(o,y),V(o,b),[o,M]},$2h:function(B){var Y=this,L=Y._layout,x=o&&B.s("draggable")?H("a"):z(),m=h(),a=z(),j=B.getName()||"",w=B.s("title")||B.getToolTip()||j,f=Y._itemMargin;m[p]="image-box";var q=Y.getItemImageWidth(),W=Y.getItemImageHeight();return t.setCanvas(m,q,W),V(x,m),a[C]=j,a[p]="label-box","iconsonly"!==L&&V(x,a),x[p]="palette-item",u(x,"vertical-align",D),u(x,"cursor","pointer"),u(x,"border-radius",5+e),u(x,"border","1px solid transparent"),u(x,"text-align","center"),u(x,"display","inline-block"),u(x,"margin-left",f+e),u(x,"margin-top",f+e),u(x,"color",n.paletteContentLabelColor),"smallicons"===L?(u(m,"vertical-align","middle"),u(x,"margin-left",2+e),u(x,"margin-top",2+e),u(x,"padding",2+e),u(x,"text-align",y),u(a,"display","inline-block"),u(a,"min-width",Y.$21h+Y._itemMargin+e)):"largeicons"===L&&(u(a,"max-width",q+e),u(a,"overflow","hidden")),x.$11h=B.getId(),w&&(x.title=w),B.s("draggable")&&!Y.handleDragAndDrop&&(o?(x.href="#",u(x,"text-decoration",S)):x.draggable="true"),x},$16h:function(B,u,f,K){var j=t.initContext(B);t.translateAndScale(j,0,0,1),j.clearRect(0,0,f,f);var d=(f-K)/2;n.drawStretchImage(j,n.getImage(u),"fill",0,d,K,K),j.restore()},$15h:function(y){var d=this,w=y.getId(),c=d._view.querySelector(".palette-toggle-icon-"+w),l=y.isExpanded()?n.paletteCollapseIcon:n.paletteExpandIcon;if(c&&l){var k=d.$19h(),u=d.$20h();d.$16h(c,l,k,u)}},_drawToolsIcon:function(z){var w=this,B=z.s("tools");if(B)for(var Q=0;Q<B.length;Q++){var a=w._view.querySelector(".palette-header-tool"+z.getId()+"-"+Q),r=B[Q].icon,n=w.$19h(),Z=w.$20h();w.$16h(a,r,n,Z)}},$14h:function(L){var J=this,B=L.getId(),y=J.$10h[B].querySelector(".image-box"),_=L.getImage(),s=L.s("image.stretch");if(y&&_){var P=t.initContext(y),w=J.getItemImagePadding();w="smallicons"===J._layout?w/2:w;var G=J.getItemImageWidth()-2*w,O=J.getItemImageHeight()-2*w;t.translateAndScale(P,0,0,1),P.clearRect(0,0,G,O),n.drawStretchImage(P,n.getImage(_),s,w,w,G,O,L,J),P.restore()}},validateImpl:function(){var D,T,q,U=this,x=U.$9h,F=U._layout,O=U.$10h,K=U.$4h,t=U._view,R=U.dm();if(U.$13h&&(delete U.$13h,K={},R.each(function(d){K[d.getId()]=d})),"smallicons"===F)for(var z in K){var $=K[z];if($ instanceof Z){var N=$.getName()||"",A=n.getTextSize(n.paletteContentLabelFont,N).width;U.$21h!=f&&U.$21h>A||(U.$21h=A)}}for(var z in K){q=K[z];var M,o;if(R.contains(q)){if(q instanceof ht.Group){var w,p=U.$1h(q),k=O[q.getId()];k&&(w=k.nextSibling,l(t,w),l(t,k)),T=R.getSiblings(q).indexOf(q);var G=t.children[2*T]||U._79O;G&&G.parentNode?(t.insertBefore(p[0],G),t.insertBefore(w||p[1],G)):(t.appendChild(p[0]),t.appendChild(w||p[1])),O[q.getId()]=p[0],D=x[q.getId()]=w||p[1],o=q.$12h;var y=q.s("promptText");o||(q.$12h=H("div"),q.$12h[C]=y||"",o=q.$12h),0===q.getChildren().size()?D.contains(o)||V(D,o):D.contains(o)&&l(D,o)}else if(M=q.getParent()){var J=U.$2h(q),L=O[q.getId()];D=x[M.getId()],L&&l(L.parentNode,L),T=R.getSiblings(q).indexOf(q);var c=D.children[T];c?D.insertBefore(J,c):V(D,J),O[q.getId()]=J,U.$14h(q)}}else{var u=O[q.getId()],Q=u.parentNode;if(q instanceof ht.Group){var I=u.nextSibling;l(t,u),l(t,I),delete x[q.getId()]}else l(Q,u),0===Q.children.length&&(M=R.getDataById(Q.$11h),M&&(o=M.$12h,o&&!Q.contains(o)&&V(Q,o)));delete O[q.getId()]}}U.$4h={};var b=function(){var k=U._59I,V=0;U.$32h!=f&&(clearInterval(U.$32h),V=0,delete U.$32h),U.$32h=setInterval(function(){U.$31h(),k===U._59I?(V++,V>=2&&(clearInterval(U.$32h),delete U.$32h)):(V=0,k=U._59I)},30)};for(var E in x)if(D=x[E],q=R.getDataById(x[E].$11h),U.$15h(q),U._drawToolsIcon(q),q.isExpanded()){if(D.style.maxHeight===0+e){var _=D.scrollHeight+U._itemMargin+e;X(D).duration(200).set(P,_).set("padding-bottom",U._itemMargin+e).end(function(){return function(){b()}}(_))}else D.style.maxHeight=D.scrollHeight+e;D.style.paddingBottom=U._itemMargin+e}else D.style.maxHeight!==0+e&&X(D).duration(200).set(P,g).set("padding-bottom",g).end(function(){return function(){b()}}(D));U.$28h(),U.$31h()},$31h:function(){for(var t=this,Q=t._view,r=0,v=Q.children,z=0;z<v.length;z++){var I=v[z];I.className&&I.className.indexOf("palette-")>=0&&(r+=I.offsetHeight)}t._59I=r,t.$30h=t.$33h(t.ty());var C=t.ty();Q.scrollTop=-C,t._29I={x:0,y:-C,width:Q.clientWidth,height:Q.clientHeight},u(t._79O,D,-C+e),t._93I()},$33h:function(m){var U=this,M=U._29I.height-U._59I;return M>m&&(m=M),m>0?0:Math.round(m)},redraw:function(){this.$13h||(this.$13h=1,this.iv())},onPropertyChanged:function(g){["autoHideScrollBar","scrollBarSize","scrollBarColor","translateY"].indexOf(g.property)<0&&this.redraw(),"translateY"===g.property&&(this.iv(),this._43o())},findDataByName:function(i){for(var p=this.dm().getDatas(),J=0;J<p.size();J++){var o=p.get(J);if(o.getName()===i)return o}},setDataModel:function(R){var m=this,o=m._dataModel,f=m._selectionModel;o!==R&&(o&&(o.umm(m.$6h,m),o.umd(m.$8h,m),o.umh(m.$7h,m),f||o.sm().ums(m.$28h,m)),m._dataModel=R,R.mm(m.$6h,m),R.md(m.$8h,m),R.mh(m.$7h,m),f?f._21I(R):R.sm().ms(m.$28h,m),m.sm().setSelectionMode("single"),m.fp("dataModel",o,R))},$6h:function(w){var _=this,L=_._view,G=w.data,h=_.$4h;"add"===w.kind?h[G.getId()]=G:"remove"===w.kind?h[G.getId()]=G:"clear"===w.kind&&(_.$10h={},_.$9h={},_.$4h={},L[C]=""),_.iv()},$7h:function(b){var D=this,a=b.data;D.$4h[a.getId()]=a,D.iv()},$8h:function(p){var Q=this,N=p.data,D=p.property;"expanded"===D?Q.iv():(Q.$4h[N.getId()]=N,Q.iv())},$28h:function(){var o,H=this,F=H.sm(),f="palette-item",c=F.ld();this.dm().each(function(e){o=H.$10h[e.getId()],o&&o[p].indexOf(f)>=0&&(e===c?u(o,R,n.paletteItemSelectBackground):U(o,R))})}})}("undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:(0,eval)("this"),Object);