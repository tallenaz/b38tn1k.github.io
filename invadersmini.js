var canvas,colors=["#0f0","#ff0","#0ff","#f0f"];function rcol(){return colors[int(random(colors.length))]}function rcolsub(n,r){return n[random(r)]}function coin(){return random(1)>.5}function randint(n){return random(n)}function keyPressed(){"s"==key?saveImage():generate()}function saveImage(){var n=year()+nf(month(),2)+nf(day(),2)+"-"+nf(hour(),2)+nf(minute(),2)+nf(second(),2);save(n+".png")}function generate(){background(0),noStroke();for(var n=int(height/150),r=int(width/150),e=0;e<n;e++)for(var o=0;o<25;o++)fill(rcol()),invader(o*(width/r)+width/(2*r),e*(height/n)+height/(2*n),5,random(5,7),8)}function invader(n,r,e,o,t){o=float(int(o)),t=float(int(t));for(var i=new Array,a=0,f=0;f<o;f++){i[f]=new Array;for(var c=0;c<t;c++)i[f][c]=random(2),i[f][c]=i[f][c]+sin(radians(90*f/o)),i[f][c]=i[f][c]+sin(radians(c/t*180)),i[f][c]>a&&(a=i[f][c])}var d=0,u=0;for(f=0;f<o;f++)for(c=0;c<t;c++)i[f][c]=i[f][c]/a,d+=i[f][c],u++;var s=d/u,h=0,v=0;push(),translate(n-e*int(o),r-e*int(t/2));for(f=0;f<o;f++){for(c=0;c<t;c++)i[f][c]>s&&rect(h,v,e,e),v+=e;v=0,h+=e}var w=int(o)-1;for(f=0;f<o;f++){for(c=0;c<t;c++)i[w-f][c]>s&&rect(h,v,e,e),v+=e;v=0,h+=e}pop()}function setup(){canvas=createCanvas(window.innerWidth,window.innerHeight),smooth(8),pixelDensity(2),background(0),generate(),noStroke()}function mouseClicked(){generate()}function draw(){}function touchStarted(){generate()}function touchMoved(){return!1}function touchEnded(){}function deviceTurned(){canvas=createCanvas(window.innerWidth,window.innerHeight)}window.onresize=function(){var n=window.innerWidth,r=window.innerHeight;console.log(n," ",r),canvas.size(n,r),width=n,height=r,generate()};