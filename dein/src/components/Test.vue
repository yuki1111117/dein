<template lang="">
  <div id="overlay">
    <div id="content">
      <p>これがモーダルウィンドウです。</p>
      <p><button>close</button></p>
    </div>
  </div>
  >
</template>
<script>
import axios from "axios";
export default {
  name: "Test",
  //API格納用のプロパティ
  data: function() {
    return {
      bpi: null
    };
  },

  //axiosによるデータ取得処理
  mounted: function() {
    axios
      .get("https://api.coindesk.com/v1/bpi/currentprice.json")
      .then(
        function(response) {
          //デバッグ用にconsoleに出力
          console.log(response.data.bpi);
          this.bpi = response.data.bpi;
        }.bind(this)
      )
      .catch(function(error) {
        console.log(error);
      });
  }
};
</script>
<style lang=""></style>
