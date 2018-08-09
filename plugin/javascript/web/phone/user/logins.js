+function (e, o) {
    var t = {
        init: function (n) {
            common.config.authPath = "http://auth.dddingjiu.com", window.localStorage.setItem("isUnLogin", 1);
            var a = document.getElementById("code"), i = e(".submit"),
                c = document.getElementById("item1").getElementsByTagName("input"),
                s = document.getElementById("item2").getElementsByTagName("input");
            if (t.active(c, i[0], null), t.active(s, i[1], a), e("#item1").on("tap", ".submit", function () {
                    if (common.loading(), "" != c[0].value && "" != c[1].value) {
                        var e = {accountTypeId: 0, loginName: c[0].value, loginPass: c[1].value};
                        n = {}, n.data = e, n.urlPath = common.config.appPath + "/capi/user/login.json", t.initPage(n)
                    }
                }), e("#item2").on("tap", ".submit", function () {
                    if (common.loading(), "" != s[0].value && "" != s[1].value) {
                        var e = (new Date).getTime().toString(), o = {
                            accountTypeId: 100,
                            loginName: s[0].value,
                            validateCode: s[1].value,
                            request_key: e,
                            request_token: window.md5("car-capi-" + e + "--esuoh-house")
                        };
                        n = {}, n.data = o, n.urlPath = common.config.carAppPath + "/capi/sms/validate/sendOnLoginWithPhone.json", t.initPage(n)
                    }
                }), o.getElementById("weixin").addEventListener("tap", function () {
                    common.loading();
                    var e = {
                        urlPath: common.config.authPath + "/authentication/openid",
                        data: {openid: "ohyrYvpdky_RHonUreTmflifiaMM"},
                        onSuccess: function (e) {
                            localStorage.setItem("accessGrant", JSON.stringify(e));
                            var o = {
                                urlPath: common.config.appPath + "/api/user/getLoginInfo",
                                data: {openid: "ohyrYvpdky_RHonUreTmflifiaMM"},
                                onSuccess: function (e) {
                                    AjaxCommon.setLoginUser(e), setTimeout(function () {
                                        window.location.href = void 0 == common.queryToJSON().callback ? common.config.homeUrl : common.queryToJSON().callback
                                    }, 300)
                                }
                            };
                            AjaxCommon.getAjaxRequestJson(o)
                        },
                        onComplete: function () {
                        },
                        onError: function () {
                            common.removeLoader(), common.alert({msg: "失败回调"}), setTimeout(function () {
                                common.removeBlockUI()
                            }, 1500)
                        }
                    };
                    AjaxCommon.getAjaxRequestJson(e)
                }), void 0 != common.queryToJSON().wxlogin) {
                common.loading();
                var m = window.location.href.split("#")[0], a = common.queryToJSON().code,
                    u = common.queryToJSON().openid,
                    r = void 0 == common.queryToJSON().callback ? common.config.homeUrl : common.queryToJSON().callback,
                    l = void 0 == common.queryToJSON().from ? "" : common.queryToJSON().from, d = {};
                if (void 0 == a && void 0 == u) {
                    var g = {
                        urlPath: common.config.appPath + "/api/user/getWechatAuthorizeUrl",
                        data: {url: m},
                        isHeader: !1,
                        onSuccess: function (e) {
                            common.removeLoader(), window.location.href = e.data
                        },
                        onError: function () {
                            window.location.reload()
                        }
                    };
                    AjaxCommon.getAjaxRequestJson(g)
                } else if (void 0 != a) if (d.code = a, "" != l && null != l) r += r.indexOf("?") != -1 ? "&code=" + a : "?code=" + a, window.location.href = window.decodeURIComponent(r); else {
                    var g = {
                        urlPath: common.config.appPath + "/auth/weixin", data: d, onSuccess: function (e) {
                            localStorage.setItem("accessGrant", JSON.stringify(e)), common.removeLoader();
                            var o = {
                                urlPath: common.config.appPath + "/api/user/getLoginInfo",
                                data: {},
                                onSuccess: function (e) {
                                  
                                    AjaxCommon.setLoginUser(e), common.alert({
                                        msg: "登录成功！", onHidden: function () {
                                            window.location.replace(r)
                                        }
                                    })
                                },
                                onError: function () {
                                    console.log("失败")
                                }
                            };
                            AjaxCommon.getAjaxRequestJson(o)
                        }, onError: function () {
                            window.location.reload()
                        }
                    };
                    AjaxCommon.getAjaxRequestJson(g)
                }
            }
            e("#item1").on("tap", ".us-word", function (e) {
                e.target.className.indexOf("us-word-display") > 0 ? (e.target.parentNode.getElementsByTagName("input")[0].type = "password", e.target.classList.remove("us-word-display")) : (e.target.parentNode.getElementsByTagName("input")[0].type = "text", e.target.classList.add("us-word-display"))
            }), e(".mui-content").on("tap", ".mui-icon-clear", function () {
                for (var e = 0; e < i.length; e += 1) i[e].classList.add("opacity7")
            })
        }, upword: function (e) {
            var o = document.getElementById("code"), n = document.getElementById("submit"),
                a = document.getElementById("uppass").getElementsByTagName("input");
            t.active(a, n, o), t.upPassCode(o, a[0], 60), n.addEventListener("tap", function () {
                if (common.loading(), "" != a[0].value && "" != a[1].value && "" != a[2].value) {
                    var o = (new Date).getTime().toString();
                    a[2].value, a[1].value, window.md5("car-capi-" + o + "-house");
                    e = {}, t.initPage(e)
                }
            })
        }, register: function (e) {
            var o = document.getElementById("code"), n = document.getElementById("submit"),
                a = document.getElementById("register").getElementsByTagName("input");
            t.active(a, n, o), t.registerCode(o, a[0], 60), n.addEventListener("tap", function () {
                if ("" != a[0].value && "" != a[1].value && "" != a[2].value && "" != a[3].value) {
                    var o = ((new Date).getTime().toString(), {
                        mobilePhone: a[0].value,
                        validate_code: a[1].value,
                        password: a[2].value,
                        referralCode: a[3].value
                    });
                    e = {}, e.data = o, e.urlPath = common.config.carAppPath + "/capi/user/regist/registOnInvite/juhe.json", t.initPage(e)
                }
            })
        }, active: function (e, o, t) {
            for (var n = !0, a = 0; a < e.length; a += 1) e[a].addEventListener("keyup", function () {
                if ("tel" == this.name) /^1[34578]\d{9}$/.test(this.value) ? t.classList.add("default-but-active") : t.classList.remove("default-but-active"); else {
                    for (var a = 0; a < e.length; a += 1) if ("" == e[a].value) return n = !1, o.classList.add("opacity7"), !1;
                    n && o.classList.remove("opacity7"), n = !0
                }
            })
        }, loginsCode: function (e, o, t) {
            e.addEventListener("tap", function () {
                if (this.className.indexOf("default-but-active") > 0) {
                    this.classList.remove("default-but-active");
                    var n = setInterval(function () {
                        t -= 1, e.innerText = t + "秒", 1 == t && (t = 60, e.classList.add("default-but-active"), e.innerText = "获取验证码", clearInterval(n))
                    }, 1e3), a = {
                        urlPath: common.config.carAppPath + "/capi/sms/validate/sendOnLoginWithPhone.json",
                        data: {mobilePhone: o.value, request_key: (new Date).getTime().toString()},
                        onSuccess: function (e) {
                            1 == e.head.bcode && console.log("yes")
                        },
                        onError: function () {
                            console.log("账号不存在")
                        }
                    };
                    AjaxCommon.getAjaxRequestJson(a)
                }
            })
        }, upPassCode: function (e, o, t) {
            e.addEventListener("tap", function () {
                if (this.className.indexOf("default-but-active") > 0) {
                    this.classList.remove("default-but-active");
                    var n = setInterval(function () {
                        t -= 1, e.innerText = t + "秒", 1 == t && (t = 60, e.classList.add("default-but-active"), e.innerText = "获取验证码", clearInterval(n))
                    }, 1e3), a = {
                        urlPath: common.config.carAppPath + "/capi/sms/validate/sendOnForgetPass/" + o.value + ".json",
                        data: {request_key: (new Date).getTime().toString()},
                        onSuccess: function (e) {
                            1 == e.head.bcode && console.log("yes")
                        },
                        onError: function () {
                            console.log("账号不存在")
                        }
                    };
                    AjaxCommon.getAjaxRequestJson(a)
                }
            })
        }, registerCode: function (e, o, t) {
            e.addEventListener("tap", function () {
                if (this.className.indexOf("default-but-active") > 0) {
                    this.classList.remove("default-but-active");
                    var n = setInterval(function () {
                        t -= 1, e.innerText = t + "秒", 1 == t && (t = 60, e.classList.add("default-but-active"), e.innerText = "获取验证码", clearInterval(n))
                    }, 1e3), a = {
                        urlPath: common.config.carAppPath + "/capi/sms/validate/sendOnRegist/" + o.value + ".json",
                        data: {request_key: (new Date).getTime().toString()},
                        onSuccess: function (e) {
                            1 != e.head.bcode && common.alert({msg: e.head.bmessage || "号码已注册"})
                        },
                        onError: function () {
                            console.log("账号已存在")
                        }
                    };
                    AjaxCommon.getAjaxRequestJson(a)
                }
            })
        }, initPage: function (e) {
            var o = {
                urlPath: e.urlPath, data: e.data, onSuccess: function (e) {
                    1 == e.head.bcode ? setTimeout(function () {
                        window.location.href = void 0 == common.queryToJSON().callback ? common.config.rootPath + "/phone/index.html" : common.queryToJSON().callback
                    }, 300) : (common.removeLoader(), common.alert({msg: e.head.bmessage || "账号或密码错误"}), setTimeout(function () {
                        common.removeBlockUI()
                    }, 1500))
                }, onError: function () {
                    console.log("失败回调")
                }
            };
            AjaxCommon.getAjaxRequestJson(o)
        }
    };
    window.logins = t
}(mui, document);