<template>
    <div id="app">
      <div class="container">
        <div class="panel panel-sm">
          <div class="panel-body">
            <div class="form-group">
              <label for="csv_file" class="control-label col-sm-3 text-right">CSV file to import</label>
              <div class="col-sm-9">
                <input type="file" id="csv_file" name="csv_file" class="form-control" @change="loadCSV($event)">
              </div>
            </div>
            <div class="col-sm-offset-3 col-sm-9">  
              <br>
              <button class="button" @click="showModal = true"> View CSV </button>
                <transition name="fade" appear>
                <div class="modal-overlay" v-if="showModal" @click="showModal = false"></div>
                </transition>
                <transition name="slide" appear>
                <div class="modal" v-if="showModal" style="max-height:500px;overflow:scroll">
                  <table v-if="parse_csv">
                    <thead>
                    <tr>
                    <th v-bind:for="key in parse_header" @click="sortBy(key)" :class="{ active: sortKey == key }"> {{ key | capitalize }}
                      <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'"> </span>
                    </th>
                    </tr>
                    </thead> 
                    <tr v-bind:for="csv in parse_csv">
                      <td v-bind:for="key in parse_header">{{csv[key]}} </td>
                    </tr>
                  </table>
                    <button class="button" @click="showModal = false">Close</button>
                </div>
                </transition>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default{
  data() {
    return {
      channel_name: '',
      channel_fields: [],
      channel_entries: [],
      parse_header: [],
      parse_csv: [],
      sortOrders:{},
      sortKey: '',
      showModal:false,

    };
  },
  filters: {
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },
  methods: {
    sortBy: function (key) {
      var vm = this
      vm.sortKey = key
      vm.sortOrders[key] = vm.sortOrders[key] * -1
    },
    csvJSON(csv){
      var vm = this
      var lines = csv.split("\n")
      var result = []
      var headers = lines[0].split(",")
      vm.parse_header = lines[0].split(",") 
      lines[0].split(",").forEach(function (key) {
        vm.sortOrders[key] = 1
      })
      lines.map(function(line, indexLine){
        if (indexLine < 1) 
          return
        var obj = {}
        var currentline = line.split(",")
        headers.map(function(header, indexHeader){
          obj[header] = currentline[indexHeader]
        })
        result.push(obj)
      })
      result.pop()
      return result
    },
    loadCSV(e) {
      var vm = this
      if (window.FileReader) {
        var reader = new FileReader();
        reader.readAsText(e.target.files[0]);
        reader.onload = function(event) {
          var csv = event.target.result;
          vm.parse_csv = vm.csvJSON(csv)
          
        };
        reader.onerror = function(evt) {
          if(evt.target.error.name == "NotReadableError") {
            alert("Canno't read file !");
          }
        };
      } else {
        alert('FileReader are not supported in this browser.');
      }
    }
  }
};  
</script>
<style scoped>
html, body {
  margin: 0;
  padding: 0;
}
body {
  margin: 32px auto;
} 
.panel.panel-sm {
  max-width: 700px;
  margin: 10px auto;
}
.panel-heading {
  border-bottom: 2px solid #dfdfdf;
}
.panel-body .checkbox-inline {
  padding: 15px 20px;
}
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}
td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}
.modal-overlay {
    position: absolute;
    z-index: 98;
}
.modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99;
    height:100%;
    max-height:400px;
    width: 100%;
    max-width: 400px;
    background-color: silver;
    border-radius: 16px;
    padding: 25px;
    border-color:red;
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity .5s;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}
.slide-enter-active,
.slide-leave-active {
 transition: transform .5s;
}
.slide-enter,
.slide-leave-to {
 transform: translateY(-50%) translateX(100vw);
}
</style>