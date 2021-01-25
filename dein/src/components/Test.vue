<template lang="">
  <h1>{{ msg }}</h1> <button>Modal Test</button> <div id="overlay"> <div
  id="content"> <p>これがモーダルウィンドウです。</p>
  <p><button>close</button></p> </div> </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Test",
  props: {
    msg: String,
  },
  data: function () {
    return {
      bpi: null,
    };
  },
  mounted: function () {
    axios
      .get("https://api.coindesk.com/v1/bpi/currentprice.json")
      .then(
        function (response) {
          //デバッグ用にconsoleに出力
          console.log(response.data.bpi);
          this.bpi = response.data.bpi;
        }.bind(this)
      )
      .catch(function (error) {
        console.log(error);
      });
  },
};
</script>

<style scoped>
#overlay {
  /*  要素を重ねた時の順番  */
  z-index: 1;

  /*  画面全体を覆う設定  */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);

  /*  画面の中央に要素を表示させる設定  */
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
