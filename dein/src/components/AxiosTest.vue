<template lang="">
    <div>

    </div>
</template>

<script>
import axios from "axios";
export default {
  name: "AxiosTest",
  mounted() {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  },
};
</script>

<style lang="">
</style>