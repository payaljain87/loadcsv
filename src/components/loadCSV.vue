<template>
    <div id="app">
          <div class="panel-body">
            <div class="form-group">
              <label for="csv_file" class="control-label col-sm-3 text-right">CSV file to import</label>
              <div class="col-sm-9">
                <input type="file" id="csv_file" name="csv_file" class="form-control" @change="loadCSV($event)">
              </div>
            </div>
              <br>
              <div class="col-sm-offset-3 col-sm-9">
                <a href="#" class="btn btn-primary">View CSV</a>
              </div>
              <table v-if="parse_csv">
                <thead>
                  <tr>
                    <th v-for="key in parse_header" :key="key" @click="sortBy(key)" :class="{ active: sortKey == key }"> {{ key | capitalize }}
                      <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'"> </span>
                    </th>
                  </tr>
                </thead> 
                  <tr v-for="(csv,index) in parse_csv" :key="index">
                    <td v-for="key in parse_header" :key="key">{{csv[key]}} </td>
                  </tr>
                </table>
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
      modal:false

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
</style>