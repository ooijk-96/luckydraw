<template>
    <div class="modal prize-modal" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="fas fa-award"></i>
                        獎項名單
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <textarea class="form-control" v-model="prizeListTextarea" placeholder="请一行一行条例输入奖项名单"></textarea>
                    </div>
                    <!-- <template v-for="(prize, prizeSN) in prizeList">
                        <div class="input-group mb-3" v-if="focusEditSN === prizeSN">
                            <input type="text" ref="prizeEdit" class="form-control" v-model="editPrize" placeholder="編輯獎項名稱">
                            <div class="input-group-append">
                                <span class="input-group-text btn-success" style="cursor: pointer" v-on:click="saveEditPrize(prize)">
                                    <i class="far fa-save"></i>
                                </span>
                            </div>
                        </div>
                        <div class="input-group mb-3" v-else>
                            <div class="form-control">{{prize}}</div>
                            <div class="input-group-append">
                                <span class="input-group-text" style="cursor: pointer" v-on:click="openEditPrize(prizeSN, prize)">
                                    <i class="far fa-edit"></i>
                                </span>
                            </div>
                        </div>
                    </template> -->

                    <!-- <hr/> -->

                    <!-- <template v-if="!addAutoGenPrizeFlag">
                        <button type="button" class="btn btn-info btn-block mb-3" v-on:click="openAutoGenPrize(true)">生成奖项</button>
                    </template>
                    <template v-else>
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" v-model="autoGenAmt" placeholder="生成奖项数量">
                            <div class="input-group-append">
                                <span class="input-group-text" style="cursor: pointer" v-on:click="saveAutoGenPrize">
                                    <i class="fas fa-arrow-right"></i>
                                </span>
                            </div>
                        </div>
                    </template> -->

                    <!-- <template v-if="!addNewFlag">
                        <button type="button" class="btn btn-info btn-block mb-3" v-on:click="openAddPrize(true)">新增獎項</button>
                    </template>
                    <template v-else>
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" v-model="autoGenAmt" placeholder="生成奖项数量">
                            <div class="input-group-append">
                                <span class="input-group-text" style="cursor: pointer" v-on:click="saveAutoGenPrize">
                                    <i class="fas fa-arrow-right"></i>
                                </span>
                            </div>
                        </div>
                    </template> -->
                </div>
                <div class="modal-footer">
                    <div class="col-6 text-left">
                        <template v-if="!addAutoGenPrizeFlag">
                            <button type="button" class="btn btn-info btn-block" v-on:click="openAutoGenPrize(true)">生成奖项</button>
                        </template>
                        <template v-else>
                            <div class="input-group">
                                <input type="text" class="form-control" v-model="autoGenAmt" placeholder="生成奖项数量">
                                <div class="input-group-append">
                                    <span class="input-group-text" style="cursor: pointer" v-on:click="saveAutoGenPrize">
                                        <i class="fas fa-arrow-right"></i>
                                    </span>
                                </div>
                            </div>
                        </template>
                        <!-- <button type="button" class="btn btn-warning" >打亂排序</button>
                        <button type="button" class="btn btn-warning" >重设</button> -->
                    </div>
                    <div class="col-6 text-right">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-primary" v-on:click="save">儲存</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import {mixpanel} from 'lib/common/util';

let targetDom = null;

export default {
    data: function() {
        return {
            prizeListTextarea: "",

            addAutoGenPrizeFlag: false,
            autoGenAmt: "",

            addNewFlag: false,
            newPrize: "",

            focusEditSN: false,
            editPrize: "",
        }
    },
    methods: {
        save: function(){
            const that = this;
            const params = {
                prizeListInput: that.prizeListTextarea
            };
            
            that.$store.dispatch("setPrizeListInput", params);
            targetDom.modal("hide");

            mixpanel.track("save prize list", params);
        },
        openEditPrize: function(prizeSN, prizeName){
            const that = this;
            that.focusEditSN = prizeSN;
            that.editPrize = prizeName;
        },
        saveEditPrize: function(prize){
            const that = this;
            if ( !!that.editPrize) {
                let prizeList = JSON.parse( JSON.stringify( that.prizeList) );
                let match = prizeList.filter(function(prize, index){
                    return that.editPrize == prize && (index != that.focusEditSN);
                });

                if (match.length == 0) {
                    const params = {
                        sn: that.focusEditSN,
                        prize: that.editPrize,
                        orgPrize: prize,
                    }

                    that.$store.dispatch("saveEditPrize", params);
                    that.editPrize = "";
                    that.focusEditSN = false;

                    mixpanel.track("edit prize", params);
                } else {
                    alert("已有相同的獎項");
                }
            }
        },
        openAddPrize: function( flag){
            const that = this;
            that.addNewFlag = flag;
        },
        openAutoGenPrize: function( flag){
            const that = this;
            that.addAutoGenPrizeFlag = flag;
        },
        saveNewPrize: function() {
            const that = this;
            if ( !!that.newPrize) {
                let prizeList = JSON.parse( JSON.stringify( that.prizeList) );

                if (!prizeList.includes(that.newPrize)) {
                    const params = {
                        prize: that.newPrize,
                    }
                    that.$store.dispatch("saveNewPrize", params);
                    that.newPrize = "";
                    that.addNewFlag = false;

                    mixpanel.track("add prize", params);
                } else {
                    alert("已有相同的獎項");
                }
            }
        },
        saveAutoGenPrize: function(){
            const that = this;
            if(that.autoGenAmt.match(/^\d{1,3}$/g)) {
                let prizeInputTemp = "";

                for (let i = 1; i <= that.autoGenAmt; i++) {
                    prizeInputTemp = prizeInputTemp.concat(i).concat('\n')
                }
                
                const params = {
                    prizeListInput: prizeInputTemp
                };
                
                that.$store.dispatch("setPrizeListInput", params);
                targetDom.modal("hide");

                mixpanel.track("save prize list", params);
            }
            else {
                alert("输入失败！生成奖项数量只能3个数字")
            }
            
        },
    },
    watch: {
        triggerOpenPrizeList: function() {
            const that = this;
            targetDom.modal("show");
        },
    },
    computed: {
        ...mapGetters([
            "triggerOpenPrizeList",
            "prizeListInput",
            "prizeList_sort",
            "prizeList",
        ])
    },
    mounted() {
        const that = this;
        targetDom = $(that.$el);
        targetDom.bind("shown.bs.modal", function() {
            that.prizeListTextarea = that.prizeListInput;

            that.addAutoGenPrizeFlag = false,
            that.autoGenAmt = "",
            
            that.addNewFlag = false;
            that.newPrize = "";

            that.focusEditSN = false;
            that.editPrize= '';

            mixpanel.track("open prize list");
        });
    },
    props: {

    },
    components: {

    }
};
</script>