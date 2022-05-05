export function amapInit() {
    return new Promise(resolve => {
        window.onLoad = function () {
            // var map = new AMap.Map('container');
            resolve(AMap)

        }
        // let ak = 'a3cf5c778e421d3e249846f6f0e433b1';
        let ak = 'ba252320806a6ce4851f74df5d017789';
        var url = `https://webapi.amap.com/maps?v=2.0&key=${ak}&callback=onLoad&plugin=AMap.Geocoder`;
        var jsapi = document.createElement('script');
        jsapi.charset = 'utf-8';
        jsapi.src = url;
        document.head.appendChild(jsapi);
    })

}