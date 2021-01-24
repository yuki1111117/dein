<template lang="">
    <div>
        <h1>{{ msg }}</h1>
    </div>
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

<style lang="">
</style>