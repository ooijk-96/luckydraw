export default {
    initSystem(state, params) {
        let defaultConfig = JSON.parse( JSON.stringify( state.defaultConfig) );

        let luckyDraw = JSON.parse(localStorage.getItem('luckyDrawSetting'));

        // let config = JSON.parse(localStorage.getItem('config'));
        // let luckySN = JSON.parse(localStorage.getItem('luckySN'));
        // let shortlist = JSON.parse(localStorage.getItem('shortlist'));
        // let shortlistInput = JSON.parse(localStorage.getItem('shortlistInput'));
        // let shortlist_sort = JSON.parse(localStorage.getItem('shortlist_sort'));
        // let prizeList = JSON.parse(localStorage.getItem('prizeList'));

        let config = {};
        let luckySN = [];
        let shortlist = [];
        let shortlistInput = "";
        let shortlist_sort = [];
        let prizeList = [];
        let prizeListInput = "";
        let prizeList_sort = [];
        if (!!luckyDraw) {
            config = luckyDraw.config || {};
            luckySN = luckyDraw.luckySN || [];
            shortlist = luckyDraw.shortlist || [];
            shortlistInput = luckyDraw.shortlistInput || "";
            shortlist_sort = luckyDraw.shortlist_sort || [];
            prizeList = luckyDraw.prizeList || [];
            prizeListInput = luckyDraw.prizeListInput || ""; 
            prizeList_sort = luckyDraw.prizeList_sort || []; 
        }


        if ( typeof config != "object") {
            config = {};
        }

        if (!Array.isArray(luckySN)) {
            luckySN = [];
        }

        if (!Array.isArray(shortlist)) {
            shortlist = [];
        }

        if (!Array.isArray(shortlist_sort)) {
            shortlist_sort = [];
        }

        if (!Array.isArray(prizeList)) {
            prizeList = [];
        }

        if (!Array.isArray(prizeList_sort)) {
            prizeList_sort = [];
        }



        if ( typeof shortlistInput != "string") {
            shortlistInput = "";
        }

        if ( typeof prizeListInput != "string") { 
            prizeListInput = "";
        }


        state.config = {...defaultConfig, ...config};
        state.luckySN = luckySN;
        state.shortlist = shortlist;
        state.shortlistInput = shortlistInput;
        state.shortlist_sort = shortlist_sort;
        state.prizeList = prizeList;
        state.prizeListInput = prizeListInput;
        state.prizeList_sort = prizeList_sort;
    },
    saveToLocalStorage(state, params) {
        let config = JSON.parse(JSON.stringify( state.config));
        let luckySN = JSON.parse(JSON.stringify( state.luckySN));
        let shortlist = JSON.parse(JSON.stringify( state.shortlist));
        let shortlistInput = JSON.parse(JSON.stringify( state.shortlistInput));
        let shortlist_sort = JSON.parse(JSON.stringify( state.shortlist_sort));
        let prizeList = JSON.parse(JSON.stringify( state.prizeList));
        let prizeListInput = JSON.parse(JSON.stringify( state.prizeListInput));
        let prizeList_sort = JSON.parse(JSON.stringify( state.prizeList_sort));


        let luckyDraw = {
            config: config,
            luckySN: luckySN,
            shortlist: shortlist,
            shortlistInput: shortlistInput,
            shortlist_sort: shortlist_sort,
            prizeList: prizeList,
            prizeListInput: prizeListInput,
            prizeList_sort: prizeList_sort,
        };

        localStorage.setItem('luckyDrawSetting', JSON.stringify(luckyDraw));

        // localStorage.setItem('config', config);
        // localStorage.setItem('luckySN', luckySN);
        // localStorage.setItem('shortlist', shortlist);
        // localStorage.setItem('shortlistInput', shortlistInput);
        // localStorage.setItem('shortlist_sort', shortlist_sort);
        // localStorage.setItem('prizeList', prizeList);
    },

    setConfig(state, params) {
        let config = JSON.parse( JSON.stringify( state.config) );
        config = {...config, ...params.config};
        state.config = config;
    },

    clearAllListing(state, params) {
        state.luckySN = [];
        state.shortlist = [];
        state.shortlistInput = "";
        state.shortlist_sort = [];
        state.prizeList = [];
        state.prizeListInput = "";
        state.prizeList_sort = [];
    },

    clearAllData(state, params) {
        let defaultConfig = JSON.parse( JSON.stringify( state.defaultConfig) );
        state.config = defaultConfig;
        state.luckySN = [];
        state.shortlist = [];
        state.shortlistInput = "";
        state.shortlist_sort = [];
        state.prizeList = [];
        state.prizeListInput = "";
        state.prizeList_sort = [];
    },

    triggerOpenEditListModal(state, params) {
        state.triggerOpenEditList = new Date().getTime();
    },

    triggerOpenEditPrizeModal(state, params) {
        state.triggerOpenPrizeList = new Date().getTime();
    },

    triggerOpenGetLuckyModal(state, params) {
        state.triggerOpenGetLucky = new Date().getTime();
    },

    triggerOpenLuckyModal(state, params) {
        state.triggerOpenLucky = new Date().getTime();
    },

    triggerOpenResultModal(state,params) {
        state.triggerOpenResult = new Date().getTime();
    },

    triggerOpenSettingModal(state,params) {
        state.triggerOpenSetting = new Date().getTime();
    },

    editShortList(state, params) {
        let data = params.data;
        let shortlist = JSON.parse(JSON.stringify(state.shortlist));
        let luckySN = JSON.parse(JSON.stringify(state.luckySN));

        let sn = data.sn;
        if (data.lucky == "1") {
            if (!luckySN.includes(sn)) {
                luckySN.push(sn);
            }
        } else {
            let index = luckySN.indexOf(sn);
            if (index >= 0) {
                luckySN.splice(index, 1);
            }
        }

        shortlist[sn].award = data.award.split(",");

        state.shortlist = shortlist;
        state.luckySN = luckySN;
    },

    setShortListInput(state, params) {
        let shortlistInput = params.shortlistInput;
        let shortlist = JSON.parse(JSON.stringify(state.shortlist));
        let shortlist_sort = JSON.parse(JSON.stringify(state.shortlist_sort));


        let shortlistInputObj = {};
        let shortlistInputArr = shortlistInput.split("\n").map(function(data) {
            data = data.split("|").map(function(string) {
                return string.trim();
            });
            let Obj = {
                name: data[0],
                pos: data[1] || "",
            };
            return Obj;
        }).filter(function(data) {
            if (!!data.name) {
                shortlistInputObj[data.name] = data;
                return !!data.name;
            } else {
                return false;
            }
        });


        let matchName = [];
        shortlist = shortlist.map(function(data) {
            data.del = !!!shortlistInputObj[data.name];
            if (!data.del) {
                matchName.push(data.name);
                data.pos = shortlistInputObj[data.name].pos;
                if (!shortlist_sort.includes(data.sn)) {
                    shortlist_sort.push(data.sn);
                }
            } else {
                shortlist_sort = shortlist_sort.filter(function(sn) {
                    return sn != data.sn;
                });
            }
            return data;
        });

        shortlistInputArr.forEach(function(data) {
            if (!matchName.includes(data.name)) {
                let sn = shortlist.length;
                shortlist.push({
                    sn: sn,
                    name: data.name,
                    pos: data.pos,
                    award: [],
                    del: false,
                });
                shortlist_sort.push(sn);
            }
        });

        state.shortlistInput = shortlistInputArr.map(function(data) {
            return ["name", "pos"].map(function(key) {
                return data[key]
            }).filter(function(value) { return !!value }).join("|");
        }).join("\n");
        state.shortlist = shortlist;
        state.shortlist_sort = shortlist_sort;
    },

    setShortlistRandomSort(state, params) {
        let shortlist = JSON.parse(JSON.stringify(state.shortlist));
        let shortlist_sort = JSON.parse(JSON.stringify(state.shortlist_sort));

        let shortlistSN = shortlist.filter(function(data) {
            return !data.del;
        }).map(function(data) {
            return data.sn;
        });

        let loopTime = shortlistSN.length;
        let shortlistSN_new = [];
        for (let i = 0; i < loopTime; i++) {
            let length = shortlistSN.length;
            let index = parseInt(Math.random() * 100 % length);
            shortlistSN_new.push(shortlistSN[index]);
            shortlistSN.splice(index, 1);
        }
        state.shortlist_sort = shortlistSN_new;
    },

    setFocusSN(state, params) {
        state.focusSN = params;
    },

    setFocusPrizeSN(state, params) {
        state.focusPrizeSN = params;
    },

    setFocusSN2LuckySN(state, params) {
        let shortlist = JSON.parse(JSON.stringify(state.shortlist));
        let luckySN = JSON.parse(JSON.stringify(state.luckySN));
        let focusSN = JSON.parse(JSON.stringify(state.focusSN));

        let filterResult = shortlist.filter(function(data) {
            if (data.sn == focusSN) {
                let prizeNameTemp = "";

                if(params.award.prizeName != "")
                    prizeNameTemp = prizeNameTemp.concat("[").concat(params.award.prizeName).concat("]");
                else 
                    prizeNameTemp = "[-]";

                data.award.push(params.award.prize.concat(prizeNameTemp));

                return true;
            } else {
                return false;
            }
        });

        if (filterResult.length > 0 && !luckySN.includes(focusSN)) {
            luckySN.push(focusSN);
        }

        state.focusSN = null;
        state.luckySN = luckySN;
        state.shortlist = shortlist;

    },

    setPrizeListInput(state, params) {
        let prizeListInput = params.prizeListInput;
        let prizeList = JSON.parse(JSON.stringify(state.prizeList));
        let prizeList_sort = JSON.parse(JSON.stringify(state.prizeList_sort));

        let prizeListInputObj = {};
        let prizeListInputArr = prizeListInput.split("\n").map(function(data) {
            data = data.split("|").map(function(string) {
                return string.trim();
            });
            let Obj = {
                prize: data[0],
                prizeName: data[1] || "",
            };
            return Obj;
        }).filter(function(data) {
            if (!!data.prize) {
                prizeListInputObj[data.prize] = data;
                return !!data.prize;
            } else {
                return false;
            }
        });

        let matchPrize = [];
        prizeList = prizeList.map(function(data) {
            data.del = !!!prizeListInputObj[data.prize];
            if (!data.del) {
                matchPrize.push(data.prize);
                data.prizeName = prizeListInputObj[data.prize].prizeName;
                if (!prizeList_sort.includes(data.sn)) {
                    prizeList_sort.push(data.sn);
                }
            } else {
                prizeList_sort = prizeList_sort.filter(function(sn) {
                    return sn != data.sn;
                });
            }
            return data;
        });

        prizeListInputArr.forEach(function(data) {
            if (!matchPrize.includes(data.prize)) {
                let sn = prizeList.length;
                prizeList.push({
                    sn: sn,
                    prize: data.prize,
                    prizeName: data.prizeName,
                    del: false,
                });
                prizeList_sort.push(sn);
            }
        });

        state.prizeListInput = prizeListInputArr.map(function(data) {
            return ["prize", "prizeName"].map(function(key) {
                return data[key]
            }).filter(function(value) { return !!value }).join("|");
        }).join("\n");
        state.prizeList = prizeList;
        state.prizeList_sort = prizeList_sort;
    },

    saveNewPrize(state, params) {
        let prizeList = JSON.parse(JSON.stringify(state.prizeList));
        prizeList.push( params.prize );
        state.prizeList = prizeList;
    },

    saveEditPrize(state, params) {
        let prizeList = JSON.parse(JSON.stringify(state.prizeList));
        let shortlist = JSON.parse(JSON.stringify(state.shortlist));

        let oldPrize = prizeList[params.sn];
        let newPrize = params.prize;

        prizeList[params.sn] = params.prize;

        shortlist = shortlist.map(function(data){
            data.award = data.award.map(function(award){
                if (award == oldPrize) {
                    award = newPrize;
                }
                return award;
            });
            return data;
        });

        state.prizeList = prizeList;
        state.shortlist = shortlist;
    },
}