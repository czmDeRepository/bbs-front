module.exports = {
    // devServer: {
    //     proxy: {
    //         // 配置代理
    //         "/v1": {
    //             // 对凡是以/v1 开头的请求，进行代理
    //             target: "http://localhost:8081",
    //             onProxyReq(proxyReq) {
    //                 proxyReq.setHeader("orgin", "http://localhost:8081");
    //                 proxyReq.setHeader("referer", "http://localhost:8081")
    //             }
    //         }
    //     }
    // }
    devServer: {
        disableHostCheck: true
    },
    // publicPath: '/',
}