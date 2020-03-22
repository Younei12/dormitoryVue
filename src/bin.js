import Vue from "vue";
import moment from "moment";
import {convertUrl} from "@/utils/utils";

Vue.directive('no-autofill', {
  inserted(el) {
    console.log(el)
  }
});

Vue.filter("convertToDate", function (value, type = "date") {
  if (value) {
    if (type === 'date') {
      return moment(value).format('YYYY-MM-DD');
    }
    if (type === 'datetime') {
      return moment(value).format('YYYY-MM-DD HH:mm:ss');
    }
  } else {
    return ""
  }
});

Vue.filter("setEmpty", function (value, text = "无") {
  if (value === "" || value === undefined || value === null) {
    return text;
  } else {
    return value;
  }
});

Vue.filter("convertUrl",convertUrl);
