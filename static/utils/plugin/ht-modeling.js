!function(v,f,U){"use strict";var z="ht",M=v[z],m=null,F=Math,k=F.PI,$=F.cos,c=F.sin,j=F.abs,y=F.max,Q=F.sqrt,P=1e-5,x=M.Default,T=x.def,d=x.startAnim,p=x.createMatrix,_=x.transformVec,I=x.getInternal(),O=I.addMethod,Y=I.superCall,t=I.toPointsArray,g=I.createNormals,J=I.toFloatArray,X=I.glMV,Z=I.batchShape,u=I.createNodeMatrix,K=I.getFaceInfo,H=I.transformAppend,r=I.drawFaceInfo,h=I.createAnim,R=I.cube(),L=R.is,n=R.vs,a=R.uv,q=I.ui(),G=M.Node,w=M.Shape,l="h",B="v",D="front",S="back",i="left",C="right",A="top",e="bottom",o="dw.expanded",V=".expanded",s="dw.angle",N=".angle",E=function(C,I,K){T(z+"."+C,I,K)},b=function(y,V,t){t?y.push(V.x,V.y):y.push(V.x,V.y,V.z)},W=[1,0,0],El=function(z,N,j,$){var y,E,G,i,Q=0,n=[];if($)for(y=$.length;y>Q;Q+=3)E=$[Q],G=$[Q+1],i=$[Q+2],n.push(new mb([new Ho([N[3*E],N[3*E+1],N[3*E+2]],W,j?[j[2*E],j[2*E+1],0]:m),new Ho([N[3*G],N[3*G+1],N[3*G+2]],W,j?[j[2*G],j[2*G+1],0]:m),new Ho([N[3*i],N[3*i+1],N[3*i+2]],W,j?[j[2*i],j[2*i+1],0]:m)],z));else for(y=N.length;y>Q;Q+=3)E=Q,G=Q+1,i=Q+2,n.push(new mb([new Ho([N[3*E],N[3*E+1],N[3*E+2]],W,j?[j[2*E],j[2*E+1],0]:m),new Ho([N[3*G],N[3*G+1],N[3*G+2]],W,j?[j[2*G],j[2*G+1],0]:m),new Ho([N[3*i],N[3*i+1],N[3*i+2]],W,j?[j[2*i],j[2*i+1],0]:m)],z));return n},Cn=[i,D,C,S,A,e],ho=Cn.concat("csg"),ag=[0,6,12,18,24,30],ue=function(O,p,t){for(var X=u(O),i=[],J=0;6>J;J++)for(var f=Cn[J],R=ag[J],A=t?p.getFaceUv(O,f):m,S=t?p.getFaceUvScale(O,f):m,D=t?p.getFaceUvOffset(O,f):m,H=0;2>H;H++){var s,T,o,r=L[R+3*H],E=L[R+3*H+1],q=L[R+3*H+2];if(t){if(A){var F=8*J;s=[A[2*r-F],A[2*r+1-F],0],T=[A[2*E-F],A[2*E+1-F],0],o=[A[2*q-F],A[2*q+1-F],0]}else s=[a[2*r],a[2*r+1],0],T=[a[2*E],a[2*E+1],0],o=[a[2*q],a[2*q+1],0];S&&(s[0]*=S[0],s[1]*=S[1],T[0]*=S[0],T[1]*=S[1],o[0]*=S[0],o[1]*=S[1]),D&&(s[0]+=D[0],s[1]+=D[1],T[0]+=D[0],T[1]+=D[1],o[0]+=D[0],o[1]+=D[1])}i.push(new mb([new Ho(_([n[3*r],n[3*r+1],n[3*r+2]],X),W,s),new Ho(_([n[3*E],n[3*E+1],n[3*E+2]],X),W,T),new Ho(_([n[3*q],n[3*q+1],n[3*q+2]],X),W,o)],O))}return Wr.$15n(i)},Ki=function(y,x){var v,C=y.data.getAttaches();if(C&&C.each(function(g){g instanceof vd&&g.s("attach.operation")&&(v||(v=[]),v.push(g))}),v){var z;Cn.forEach(function(N){var V=El(N,y[N].vs,y[N].tuv);z=z?z.concat(V):V}),z=Wr.$15n(z),v.forEach(function(_){var E=_.s("attach.operation");z[E]&&(z=z[E](ue(_,y.gv,y.csg.tuv)))}),Cn.forEach(function(e){e=y[e],e.vs=[],e.tuv&&(e.tuv=[])}),z.$19n().forEach(function(q){var i=q.$10n;if(i instanceof vd){if(i.s("attach.cull"))return;i="csg"}for(var B=y[i],T=B.vs,h=B.tuv,f=q.$9n,K=2;K<f.length;K++)b(T,f[0].$24n),b(T,f[K-1].$24n),b(T,f[K].$24n),h&&(b(h,f[0].uv,!0),b(h,f[K-1].uv,!0),b(h,f[K].uv,!0))})}ho.forEach(function(G){var _=y[G];_.visible&&_.vs.length?(_.ns=g(_.vs),J(_,"vs"),J(_,"tuv")):delete y[G]}),x&&(Z(y,m,x),y.clear())};O(x,{createFrameModel:function(z,t,R,s){z=z==m?.07:z,t=t==m?z:t,R=R==m?z:R,s=s?s:{};var q=s.top,X=s.bottom,p=s.left,K=s.right,g=s.front,h=s.back,l=[],d=[];return g===!0?(l.push(-.5,.5,.5,-.5,-.5,.5,.5,-.5,.5,.5,-.5,.5,.5,.5,.5,-.5,.5,.5),d.push(0,0,0,1,1,1,1,1,1,0,0,0)):g===!1||(l.push(-.5,.5,.5,-.5,-.5,.5,-.5+z,-.5,.5,-.5+z,-.5,.5,-.5+z,.5,.5,-.5,.5,.5,.5-z,.5,.5,.5-z,-.5,.5,.5,-.5,.5,.5,-.5,.5,.5,.5,.5,.5-z,.5,.5,-.5+z,.5,.5,-.5+z,.5-t,.5,.5-z,.5-t,.5,.5-z,.5-t,.5,.5-z,.5,.5,-.5+z,.5,.5,-.5+z,-.5+t,.5,-.5+z,-.5,.5,.5-z,-.5,.5,.5-z,-.5,.5,.5-z,-.5+t,.5,-.5+z,-.5+t,.5),d.push(0,0,0,1,z,1,z,1,z,0,0,0,1-z,0,1-z,1,1,1,1,1,1,0,1-z,0,z,0,z,t,1-z,t,1-z,t,1-z,0,z,0,z,1-t,z,1,1-z,1,1-z,1,1-z,1-t,z,1-t)),h===!0?(l.push(-.5,.5,-.5,.5,-.5,-.5,-.5,-.5,-.5,.5,-.5,-.5,-.5,.5,-.5,.5,.5,-.5),d.push(1,0,0,1,1,1,0,1,1,0,0,0)):h===!1||(l.push(-.5,.5,-.5,-.5+z,-.5,-.5,-.5,-.5,-.5,-.5+z,-.5,-.5,-.5,.5,-.5,-.5+z,.5,-.5,.5-z,.5,-.5,.5,-.5,-.5,.5-z,-.5,-.5,.5,-.5,-.5,.5-z,.5,-.5,.5,.5,-.5,-.5+z,.5,-.5,.5-z,.5-t,-.5,-.5+z,.5-t,-.5,.5-z,.5-t,-.5,-.5+z,.5,-.5,.5-z,.5,-.5,-.5+z,-.5+t,-.5,.5-z,-.5,-.5,-.5+z,-.5,-.5,.5-z,-.5,-.5,-.5+z,-.5+t,-.5,.5-z,-.5+t,-.5),d.push(1,0,1-z,1,1,1,1-z,1,1,0,1-z,0,z,0,0,1,z,1,0,1,z,0,0,0,1-z,0,z,t,1-z,t,z,t,1-z,0,z,0,1-z,1-t,z,1,1-z,1,z,1,1-z,1-t,z,1-t)),p===!0?(l.push(-.5,.5,-.5,-.5,-.5,-.5,-.5,-.5,.5,-.5,-.5,.5,-.5,.5,.5,-.5,.5,-.5),d.push(0,0,0,1,1,1,1,1,1,0,0,0)):p===!1||(l.push(-.5,.5,-.5,-.5,-.5,-.5,-.5,-.5,-.5+R,-.5,-.5,-.5+R,-.5,.5,-.5+R,-.5,.5,-.5,-.5,.5,.5-R,-.5,-.5,.5-R,-.5,-.5,.5,-.5,-.5,.5,-.5,.5,.5,-.5,.5,.5-R,-.5,.5,-.5+R,-.5,.5-t,-.5+R,-.5,.5-t,.5-R,-.5,.5-t,.5-R,-.5,.5,.5-R,-.5,.5,-.5+R,-.5,-.5+t,-.5+R,-.5,-.5,-.5+R,-.5,-.5,.5-R,-.5,-.5,.5-R,-.5,-.5+t,.5-R,-.5,-.5+t,-.5+R),d.push(0,0,0,1,R,1,R,1,R,0,0,0,1-R,0,1-R,1,1,1,1,1,1,0,1-R,0,R,0,R,t,1-R,t,1-R,t,1-R,0,R,0,R,1-t,R,1,1-R,1,1-R,1,1-R,1-t,R,1-t)),K===!0?(l.push(.5,.5,-.5,.5,-.5,.5,.5,-.5,-.5,.5,-.5,.5,.5,.5,-.5,.5,.5,.5),d.push(1,0,0,1,1,1,0,1,1,0,0,0)):K===!1||(l.push(.5,.5,-.5,.5,-.5,-.5+R,.5,-.5,-.5,.5,-.5,-.5+R,.5,.5,-.5,.5,.5,-.5+R,.5,.5,.5-R,.5,-.5,.5,.5,-.5,.5-R,.5,-.5,.5,.5,.5,.5-R,.5,.5,.5,.5,.5,-.5+R,.5,.5-t,.5-R,.5,.5-t,-.5+R,.5,.5-t,.5-R,.5,.5,-.5+R,.5,.5,.5-R,.5,-.5+t,-.5+R,.5,-.5,.5-R,.5,-.5,-.5+R,.5,-.5,.5-R,.5,-.5+t,-.5+R,.5,-.5+t,.5-R),d.push(1,0,1-R,1,1,1,1-R,1,1,0,1-R,0,R,0,0,1,R,1,0,1,R,0,0,0,1-R,0,R,t,1-R,t,R,t,1-R,0,R,0,1-R,1-t,R,1,1-R,1,R,1,1-R,1-t,R,1-t)),q===!0?(l.push(.5,.5,.5,.5,.5,-.5,-.5,.5,-.5,-.5,.5,-.5,-.5,.5,.5,.5,.5,.5),d.push(1,1,1,0,0,0,0,0,0,1,1,1)):q===!1||(l.push(.5,.5,.5,.5,.5,-.5,.5-z,.5,-.5,.5-z,.5,-.5,.5-z,.5,.5,.5,.5,.5,-.5+z,.5,.5,-.5+z,.5,-.5,-.5,.5,-.5,-.5,.5,-.5,-.5,.5,.5,-.5+z,.5,.5,.5-z,.5,.5,.5-z,.5,.5-R,-.5+z,.5,.5-R,-.5+z,.5,.5-R,-.5+z,.5,.5,.5-z,.5,.5,.5-z,.5,-.5+R,.5-z,.5,-.5,-.5+z,.5,-.5,-.5+z,.5,-.5,-.5+z,.5,-.5+R,.5-z,.5,-.5+R),d.push(1,1,1,0,1-z,0,1-z,0,1-z,1,1,1,z,1,z,0,0,0,0,0,0,1,z,1,1-z,1,1-z,1-R,z,1-R,z,1-R,z,1,1-z,1,1-z,R,1-z,0,z,0,z,0,z,R,1-z,R)),X===!0?(l.push(.5,-.5,.5,-.5,-.5,-.5,.5,-.5,-.5,-.5,-.5,-.5,.5,-.5,.5,-.5,-.5,.5),d.push(1,0,0,1,1,1,0,1,1,0,0,0)):X===!1||(l.push(.5,-.5,.5,.5-z,-.5,-.5,.5,-.5,-.5,.5-z,-.5,-.5,.5,-.5,.5,.5-z,-.5,.5,-.5+z,-.5,.5,-.5,-.5,-.5,-.5+z,-.5,-.5,-.5,-.5,-.5,-.5+z,-.5,.5,-.5,-.5,.5,.5-z,-.5,.5,-.5+z,-.5,.5-R,.5-z,-.5,.5-R,-.5+z,-.5,.5-R,.5-z,-.5,.5,-.5+z,-.5,.5,.5-z,-.5,-.5+R,-.5+z,-.5,-.5,.5-z,-.5,-.5,-.5+z,-.5,-.5,.5-z,-.5,-.5+R,-.5+z,-.5,-.5+R),d.push(1,0,1-z,1,1,1,1-z,1,1,0,1-z,0,z,0,0,1,z,1,0,1,z,0,0,0,1-z,0,z,R,1-z,R,z,R,1-z,0,z,0,1-z,1-R,z,1,1-z,1,z,1,1-z,1-R,z,1-R)),{vs:l,uv:d}}}),O(M.Style,{"dw.flip":!1,"dw.s3":[.999,.999,.5],"dw.t3":U,"dw.expanded":!1,"dw.toggleable":!0,"dw.axis":"left","dw.start":0,"dw.end":k/2,"dw.angle":0,"attach.cull":!1,"attach.operation":"subtract"},!0),Cn.forEach(function(g){var B={};B[g+V]=!1,B[g+".toggleable"]=!1,B[g+".axis"]=i,B[g+".start"]=0,B[g+".end"]=k/2,B[g+N]=0,O(M.Style,B,!0)});var Wr=function(){this.$4n=[]};Wr.$15n=function(H){var E=new Wr;return E.$4n=H,E},Wr.prototype={clone:function(){var V=new Wr;return V.$4n=this.$4n.map(function(g){return g.clone()}),V},$19n:function(){return this.$4n},union:function(C){var J=new yl(this.clone().$4n),i=new yl(C.clone().$4n);return J.$3n(i),i.$3n(J),i.$6n(),i.$3n(J),i.$6n(),J.$7n(i.$2n()),Wr.$15n(J.$2n())},subtract:function(e){var k=new yl(this.clone().$4n),F=new yl(e.clone().$4n);return k.$6n(),k.$3n(F),F.$3n(k),F.$6n(),F.$3n(k),F.$6n(),k.$7n(F.$2n()),k.$6n(),Wr.$15n(k.$2n())},intersect:function(N){var V=new yl(this.clone().$4n),X=new yl(N.clone().$4n);return V.$6n(),X.$3n(V),X.$6n(),V.$3n(X),X.$3n(V),V.$7n(X.$2n()),V.$6n(),Wr.$15n(V.$2n())},inverse:function(){var M=this.clone();return M.$4n.map(function(c){c.flip()}),M}},Wr.cube=function(k){k=k||{};var l=new Ef(k.center||[0,0,0]),Z=k.radius?k.radius.length?k.radius:[k.radius,k.radius,k.radius]:[1,1,1];return Wr.$15n([[[0,4,6,2],[-1,0,0]],[[1,3,7,5],[1,0,0]],[[0,1,5,4],[0,-1,0]],[[2,6,7,3],[0,1,0]],[[0,2,3,1],[0,0,-1]],[[4,5,7,6],[0,0,1]]].map(function(k){return new mb(k[0].map(function(O){var f=new Ef(l.x+Z[0]*(2*!!(1&O)-1),l.y+Z[1]*(2*!!(2&O)-1),l.z+Z[2]*(2*!!(4&O)-1));return new Ho(f,new Ef(k[1]))}))}))},Wr.sphere=function(b){function m(K,X){K*=2*k,X*=k;var H=new Ef($(K)*c(X),$(X),c(K)*c(X));q.push(new Ho(D.$20n(H.$21n(f)),H))}b=b||{};for(var q,D=new Ef(b.center||[0,0,0]),f=b.radius||1,H=b.slices||16,N=b.stacks||8,Q=[],T=0;H>T;T++)for(var L=0;N>L;L++)q=[],m(T/H,L/N),L>0&&m((T+1)/H,L/N),N-1>L&&m((T+1)/H,(L+1)/N),m(T/H,(L+1)/N),Q.push(new mb(q));return Wr.$15n(Q)},Wr.cylinder=function(Z){function f(X,z,l){var L=2*z*k,r=P.$21n($(L)).$20n(J.$21n(c(L))),b=Q.$20n(d.$21n(X)).$20n(r.$21n(a)),M=r.$21n(1-j(l)).$20n(y.$21n(l));return new Ho(b,M)}Z=Z||{};for(var Q=new Ef(Z.start||[0,-1,0]),V=new Ef(Z.end||[0,1,0]),d=V.$13n(Q),a=Z.radius||1,N=Z.slices||16,y=d.$14n(),R=j(y.y)>.5,P=new Ef(R,!R,0).$12n(y).$14n(),J=P.$12n(y).$14n(),H=new Ho(Q,y.$11n()),S=new Ho(V,y.$14n()),o=[],B=0;N>B;B++){var u=B/N,m=(B+1)/N;o.push(new mb([H,f(0,u,-1),f(0,m,-1)])),o.push(new mb([f(0,m,0),f(0,u,0),f(1,u,0),f(1,m,0)])),o.push(new mb([S,f(1,m,1),f(1,u,1)]))}return Wr.$15n(o)};var Ef=function(I,K,E){var $=this;3==arguments.length?($.x=I,$.y=K,$.z=E):"x"in I?($.x=I.x,$.y=I.y,$.z=I.z):($.x=I[0],$.y=I[1],$.z=I[2])};Ef.prototype={clone:function(){return new Ef(this.x,this.y,this.z)},$11n:function(){return new Ef(-this.x,-this.y,-this.z)},$20n:function(c){return new Ef(this.x+c.x,this.y+c.y,this.z+c.z)},$13n:function(x){return new Ef(this.x-x.x,this.y-x.y,this.z-x.z)},$21n:function(Y){return new Ef(this.x*Y,this.y*Y,this.z*Y)},$16n:function(j){return new Ef(this.x/j,this.y/j,this.z/j)},$23n:function(S){return this.x*S.x+this.y*S.y+this.z*S.z},lerp:function(j,e){return this.$20n(j.$13n(this).$21n(e))},length:function(){return Q(this.$23n(this))},$14n:function(){return this.$16n(this.length())},$12n:function(A){var Y=this;return new Ef(Y.y*A.z-Y.z*A.y,Y.z*A.x-Y.x*A.z,Y.x*A.y-Y.y*A.x)}};var Ho=function(g,u,b){var x=this;x.$24n=new Ef(g),x.$22n=new Ef(u),x.uv=b?new Ef(b):null};Ho.prototype={clone:function(){var i=this;return new Ho(i.$24n.clone(),i.$22n.clone(),i.uv?i.uv.clone():null)},flip:function(){this.$22n=this.$22n.$11n()},$18n:function(i,E){var M=this;return new Ho(M.$24n.lerp(i.$24n,E),M.$22n.lerp(i.$22n,E),M.uv?M.uv.lerp(i.uv,E):null)}};var sf=function(H,s){this.$22n=H,this.w=s};sf.$17n=function(Q,w,T){var q=w.$13n(Q).$12n(T.$13n(Q)).$14n();return new sf(q,q.$23n(Q))},sf.prototype={clone:function(){return new sf(this.$22n.clone(),this.w)},flip:function(){var f=this;f.$22n=f.$22n.$11n(),f.w=-f.w},$5n:function(Y,N,m,Z,z){for(var l=this,g=0,b=1,F=2,t=3,o=0,u=[],X=0;X<Y.$9n.length;X++){var K=l.$22n.$23n(Y.$9n[X].$24n)-l.w,R=-P>K?F:K>P?b:g;o|=R,u.push(R)}switch(o){case g:(l.$22n.$23n(Y.$8n.$22n)>0?N:m).push(Y);break;case b:Z.push(Y);break;case F:z.push(Y);break;case t:for(var I=[],D=[],X=0;X<Y.$9n.length;X++){var L=(X+1)%Y.$9n.length,i=u[X],$=u[L],w=Y.$9n[X],x=Y.$9n[L];if(i!=F&&I.push(w),i!=b&&D.push(i!=F?w.clone():w),(i|$)==t){var K=(l.w-this.$22n.$23n(w.$24n))/l.$22n.$23n(x.$24n.$13n(w.$24n)),B=w.$18n(x,K);I.push(B),D.push(B.clone())}}I.length>=3&&Z.push(new mb(I,Y.$10n)),D.length>=3&&z.push(new mb(D,Y.$10n))}}};var mb=function(t,v){var i=this;i.$9n=t,i.$10n=v,i.$8n=sf.$17n(t[0].$24n,t[1].$24n,t[2].$24n)};mb.prototype={clone:function(){var X=this.$9n.map(function(y){return y.clone()});return new mb(X,this.$10n)},flip:function(){this.$9n.reverse().map(function(i){i.flip()}),this.$8n.flip()}};var yl=function(v){var k=this;k.$8n=null,k.front=null,k.back=null,k.$4n=[],v&&k.$7n(v)};yl.prototype={clone:function(){var Z=this,X=new yl;return X.$8n=Z.$8n&&Z.$8n.clone(),X.front=Z.front&&Z.front.clone(),X.back=Z.back&&Z.back.clone(),X.$4n=Z.$4n.map(function(p){return p.clone()}),X},$6n:function(){for(var B=this,P=0;P<B.$4n.length;P++)B.$4n[P].flip();B.$8n.flip(),B.front&&B.front.$6n(),B.back&&B.back.$6n();var s=B.front;B.front=B.back,B.back=s},$1n:function(o){var y=this;if(!y.$8n)return o.slice();for(var m=[],B=[],i=0;i<o.length;i++)y.$8n.$5n(o[i],m,B,m,B);return y.front&&(m=y.front.$1n(m)),B=y.back?y.back.$1n(B):[],m.concat(B)},$3n:function(B){var N=this;N.$4n=B.$1n(N.$4n),N.front&&N.front.$3n(B),N.back&&N.back.$3n(B)},$2n:function(){var T=this,w=T.$4n.slice();return T.front&&(w=w.concat(T.front.$2n())),T.back&&(w=w.concat(T.back.$2n())),w},$7n:function(L){var O=this;if(L.length){O.$8n||(O.$8n=L[0].$8n.clone());for(var N=[],U=[],G=0;G<L.length;G++)this.$8n.$5n(L[G],O.$4n,O.$4n,N,U);N.length&&(O.front||(O.front=new yl),this.front.$7n(N)),U.length&&(O.back||(O.back=new yl),O.back.$7n(U))}}};var Qr="symbol",cr=M.Symbol=function(z,M,g){var J=this;Y(cr,J),J.s3(20,20,20),J.s({"all.visible":!1,shape:"rect"}),J.setIcon(z,M,g)};E("Symbol",G,{setIcon:function(h,s,O){var q,w=this;return cr.superClass.setIcon.call(w,h),h?(q={for3d:!0,face:"center",position:44,names:[h]},O&&(q.transaprent=!0),s&&(q.autorotate=s),w.addStyleIcon(Qr,q)):w.removeStyleIcon(Qr),w.setWidth(I.getImageWidth(x.getImage(h),w)||20),q}});var vd=M.CSGNode=function(){Y(vd,this),this.s({shape:"rect","attach.thickness":1.001})},as={position:1,width:1,height:1,rotation:1,rotationX:1,rotationZ:1,rotationMode:1,tall:1,elevation:1,"s:attach.cull":1,"s:attach.operation":1};E("CSGNode",G,{_22Q:function(){return cf},onPropertyChanged:function(z){var d=this,s=d.getHost();vd.superClass.onPropertyChanged.call(d,z),as[z.property]&&(s instanceof Xp||s instanceof vd)&&s.fp("csgNodeChange",!0,!1)}});var cf=function(M,G){Y(cf,this,[M,G])};T(cf,q.Node3dUI,{_80o:function(h,w,d){var G=this;G._shape3d?cf.superClass._80o.call(G,h,w,d):(X(G.gv),ho.forEach(function(t){r(G,h,w,G[t],d)}))},validate:function(Y,_){var S=this,G=S.gv,l=S.data;if(l.s("shape3d"))return cf.superClass.validate.call(S,Y,_),S._shape3d=!0,void 0;S._shape3d=!1;var M=u(l,G.getMat(l)),T=Y&&Y.uv;S.vf2("csg",T);for(var f=0;6>f;f++)for(var Q=Cn[f],N=ag[f],v=S.vf2(Q,T,_),W=v.mat||M,t=v.vs,F=v.uv,K=v.tuv,Z=0;2>Z;Z++){var X=L[N+3*Z],O=L[N+3*Z+1],q=L[N+3*Z+2];if(H(t,W,[n[3*X],n[3*X+1],n[3*X+2]]),H(t,W,[n[3*O],n[3*O+1],n[3*O+2]]),H(t,W,[n[3*q],n[3*q+1],n[3*q+2]]),K)if(F){var D=8*f;K.push(F[2*X-D],F[2*X+1-D],F[2*O-D],F[2*O+1-D],F[2*q-D],F[2*q+1-D])}else K.push(a[2*X],a[2*X+1],a[2*O],a[2*O+1],a[2*q],a[2*q+1])}Ki(S,Y,_)},vf2:function(h,L,x){var Z,U=this,I=U.gv.getFaceVisible(U.data,h);return Z=K(U,h,x),Z.vs=[],Z.tuv=I&&(Z.texture||L)?[]:m,Z.visible=I,Z}});var Xp=M.CSGShape=function(){var C=this;Y(Xp,C),C.s({"shape.background":m,"shape.border.width":8}),C.setTall(240),C.setElevation(120),C.setThickness(14)};E("CSGShape",w,{IRotatable:!1,_22Q:function(){return qi},setRotationX:function(){},setRotation:function(){},setRotationZ:function(){},setSegments:function(){}});var qi=function(O,g){Y(qi,this,[O,g])};T(qi,q.Shape3dUI,{_80o:function(F,A,W){var h=this;h.undrawable||(X(h.gv),ho.forEach(function(C){r(h,F,A,h[C],W)}))},validate:function(i,N){var V=this,v=V.data,g=v.getPoints();if(V.undrawable=g.size()<2)return V.clear(),void 0;var o=v.isClosePath(),k=y(v._thickness/2,P),H=t(g,m,m,o);ho.forEach(function(x){V.vf(x,i&&i.uv,!0,N)}),o&&(V.left.visible=!1,V.right.visible=!1),V._12O(H,k),V._20Q(H),Ki(V,i,N)}});var Kp=M.DoorWindow=function(){var e=this;Y(Kp,e),e.setElevation(100),e.s3(100,200,14)};E("DoorWindow",vd,{IDoorWindow:!0,toggle:function(r){this.setExpanded(!this.s(o),r)},isExpanded:function(){return this.s(o)},setExpanded:function(w,r){var e=this,L=e.$25n,J=e.getDataModel(),q=e.s(o);if(L&&(L.stop(!0),delete e.$25n),q!==w){J&&J.beginTransaction();var v=w?e.s("dw.end"):e.s("dw.start");e.s(o,w),r=h(r),r?(q=e.s(s),r.action=function(A){e.s(s,q+(v-q)*A)},r.finishFunc=function(){J&&J.endTransaction()},e.$25n=d(r)):(e.s(s,v),J&&J.endTransaction())}},getMat:function(){var D=this,r=D.s("dw.s3"),d=D.s("dw.t3"),t=D.s("dw.flip"),$=D.s(s);if(r||$||d||t){var N=[];if(t&&N.push({r3:[0,k,0]}),r&&N.push({s3:r}),$){r=D.s3();var T=D.s("dw.axis"),v=r[0]/2,M=r[1]/2;r[2]/2,T===i?N.push({t3:[v,0,0]},{r3:[0,-$,0]},{t3:[-v,0,0]}):T===C?N.push({t3:[-v,0,0]},{r3:[0,$,0]},{t3:[v,0,0]}):T===A?N.push({t3:[0,-M,0]},{r3:[-$,0,0]},{t3:[0,M,0]}):T===e?N.push({t3:[0,M,0]},{r3:[$,0,0]},{t3:[0,-M,0]}):T===B?N.push({r3:[0,$,0]}):T===l&&N.push({r3:[$,0,0]})}return d&&N.push({t3:d}),p(N)}return m}});var zm=M.CSGBox=function(){var D=this;Y(zm,D),D.setElevation(100),D.s3(100,200,100)};E("CSGBox",vd,{ICSGBox:!0,toggleFace:function(e,A){this.setFaceExpanded(e,!this.s(e+V),A)},isFaceExpanded:function(b){return this.s(b+V)},setFaceExpanded:function(O,W,C){var U=this,Z=U.$25n,t=U.s(O+V);if(Z&&(Z.stop(!0),delete U.$25n),t!==W){var A=W?U.s(O+".end"):U.s(O+".start");U.s(O+V,W),C=h(C),C?(t=U.s(O+N),C.action=function(J){U.s(O+N,t+(A-t)*J)},U.$25n=d(C)):U.s(O+N,A)}},getFaceMat:function(z){var g=this,n=g.s(z+N);if(!n)return m;var c=g.s(z+".axis"),s=g.s3(),G=s[0]/2,O=s[1]/2,f=s[2]/2,w=[];return z===D&&(c===i?w.push({t3:[G,0,-f]},{r3:[0,-n,0]},{t3:[-G,0,f]}):c===C?w.push({t3:[-G,0,-f]},{r3:[0,n,0]},{t3:[G,0,f]}):c===A?w.push({t3:[0,-O,-f]},{r3:[-n,0,0]},{t3:[0,O,f]}):c===e?w.push({t3:[0,O,-f]},{r3:[n,0,0]},{t3:[0,-O,f]}):c===B?w.push({t3:[0,0,-f]},{r3:[0,n,0]},{t3:[0,0,f]}):c===l&&w.push({t3:[0,0,-f]},{r3:[n,0,0]},{t3:[0,0,f]})),z===S&&(c===i?w.push({t3:[-G,0,f]},{r3:[0,-n,0]},{t3:[G,0,-f]}):c===C?w.push({t3:[G,0,f]},{r3:[0,n,0]},{t3:[-G,0,-f]}):c===A?w.push({t3:[0,-O,f]},{r3:[n,0,0]},{t3:[0,O,-f]}):c===e?w.push({t3:[0,O,f]},{r3:[-n,0,0]},{t3:[0,-O,-f]}):c===B?w.push({t3:[0,0,f]},{r3:[0,n,0]},{t3:[0,0,-f]}):c===l&&w.push({t3:[0,0,f]},{r3:[n,0,0]},{t3:[0,0,-f]})),z===i&&(c===i?w.push({t3:[G,0,f]},{r3:[0,-n,0]},{t3:[-G,0,-f]}):c===C?w.push({t3:[G,0,-f]},{r3:[0,n,0]},{t3:[-G,0,f]}):c===A?w.push({t3:[G,-O,0]},{r3:[0,0,-n]},{t3:[-G,O,0]}):c===e?w.push({t3:[G,O,0]},{r3:[0,0,n]},{t3:[-G,-O,0]}):c===B?w.push({t3:[G,0,0]},{r3:[0,n,0]},{t3:[-G,0,0]}):c===l&&w.push({t3:[G,0,0]},{r3:[0,0,n]},{t3:[-G,0,0]})),z===C&&(c===i?w.push({t3:[-G,0,-f]},{r3:[0,-n,0]},{t3:[G,0,f]}):c===C?w.push({t3:[-G,0,f]},{r3:[0,n,0]},{t3:[G,0,-f]}):c===A?w.push({t3:[-G,-O,0]},{r3:[0,0,n]},{t3:[G,O,0]}):c===e?w.push({t3:[-G,O,0]},{r3:[0,0,-n]},{t3:[G,-O,0]}):c===B?w.push({t3:[-G,0,0]},{r3:[0,n,0]},{t3:[G,0,0]}):c===l&&w.push({t3:[-G,0,0]},{r3:[0,0,n]},{t3:[G,0,0]})),z===A&&(c===i?w.push({t3:[G,-O,0]},{r3:[0,0,n]},{t3:[-G,O,0]}):c===C?w.push({t3:[-G,-O,0]},{r3:[0,0,-n]},{t3:[G,O,0]}):c===A?w.push({t3:[0,-O,f]},{r3:[-n,0,0]},{t3:[0,O,-f]}):c===e?w.push({t3:[0,-O,-f]},{r3:[n,0,0]},{t3:[0,O,f]}):c===B?w.push({t3:[0,-O,0]},{r3:[0,0,n]},{t3:[0,O,0]}):c===l&&w.push({t3:[0,-O,0]},{r3:[n,0,0]},{t3:[0,O,0]})),z===e&&(c===i?w.push({t3:[G,O,0]},{r3:[0,0,-n]},{t3:[-G,-O,0]}):c===C?w.push({t3:[-G,O,0]},{r3:[0,0,n]},{t3:[G,-O,0]}):c===A?w.push({t3:[0,O,-f]},{r3:[-n,0,0]},{t3:[0,-O,f]}):c===e?w.push({t3:[0,O,f]},{r3:[n,0,0]},{t3:[0,-O,-f]}):c===B?w.push({t3:[0,O,0]},{r3:[0,0,n]},{t3:[0,-O,0]}):c===l&&w.push({t3:[0,O,0]},{r3:[n,0,0]},{t3:[0,-O,0]})),p(w)}})}("undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:(0,eval)("this"),Object);