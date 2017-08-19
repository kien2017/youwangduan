


var cmd=require('node-cmd');
var Decimal = require('decimal')


// window.$ = window.jQuery = require('./jquery-3.2.1.min.js')

var QRCode = require('qrcode')
var canvas = document.getElementById('displayqrcode')

var Backbone = require('backbone');
var bitcore = require('bitcore-lib'); //bu yao chong fu npm install bitcore-lib 'bitcore-explorers' zhong yijing baohan le bitcore-lib ,fou ze you chongtu
var Networks = bitcore.Networks;
var network = Networks.testnet

var explorers = require('bitcore-explorers');




// "p cQRRTGwHB288eoy5o1bGBjyREG93rgj6XnAZ6PKdj6HQx8eVoF47 cMyTQFXsoRkYgjhAT5CwnC7MXXBZSfGoEhdKcKgu58yE5ttvwW5y cV4u2EDAwR4HiQfivkCqCNtgUvFZFwuMJpyXpaviK7RXAFSaf85q"
 
// var addressArray =  [ 
//   "miKws4xtNbHvZ5sAFCqJEdJhHAiSP2tsd6", 
//   "mnjxWZWLQSFw4dor1GERYpHc4sy5nu4yKr", 
//   "n2BJiA8vupGQqe3fBteAQW6v3rpQJSPZBW"
// ]

// var Input = Backbone.Model.extend({})

// var InputCollection = Backbone.Collection.extend({
//   model: Input
// });

// var inputcollection = new InputCollection()



// var Output = Backbone.Model.extend({})

// var OutputCollection = Backbone.Collection.extend({
//   model: Output
// });

// var outputcollection = new OutputCollection()



var addressArray =[]

var hextosend =""
var Datastore = require('nedb')
  , db = new Datastore({ filename: 'addresses.db', autoload: true });

db.ensureIndex({ fieldName: 'address', unique: true }, function (err) {
});


getalladdress()
function getalladdress(){
db.find({}, function (err, docs) {
  addressArray=[]
for(var i=0;i<docs.length;i++){
  addressArray.push(docs[i]["address"])
}
})
}


var qrcodearray = []

var qrcodestr =""


let scanner = new Instascan.Scanner({ video: document.getElementById('preview'), scanPeriod: 5 });
scanner.addListener('scan', function (content) {

if(decodeqrcode(content) == true){

     

  if(qrcodestr[0] == "a"){
      qrcodestr = qrcodestr.slice(2)
      qrcodestr = qrcodestr.split(" ")
     console.log("999964"+qrcodestr)

      for(var i=0;i<qrcodestr.length;i++){

        if(qrcodestr[i].length == 34){


         db.insert({address:qrcodestr[i]})
       }else{
        alert(" scan cuo wu de shu ju le ")
       }
      }
    
    getalladdress()
   
  qrcodestr=""

setTimeout(function(){
$("#refresh").click()
},500)
 

 
  }else if(qrcodestr[0] == "b"){
   
    console.log("broadcast signed data: "+qrcodestr.slice(2))
    
    hextosend =qrcodestr.slice(2)
    qrcodestr=""

    
    listtransaction()
    $("table").show()
  }else if(qrcodestr[0] == "m"){

       qrcodestr = qrcodestr.slice(2)
      qrcodestr = qrcodestr.split(" ")

      $("#signresult").html(qrcodestr[0])

   

  }else{


  }


closeCamera()







}else{


}



  

});

$("#opencameraandscan").click(function () {
  $("#displayqrcode").hide()
  $("#preview").show()
  $("ul").empty()
openCamera()
})

$("#closecamera").click(function () {

  closeCamera()

})


function listtransaction(){




var SignInput = Backbone.Model.extend({})

var SignInputCollection = Backbone.Collection.extend({
  model: SignInput
});

var signinputcollection = new SignInputCollection()

var SignOutput = Backbone.Model.extend({})

var SignOutputCollection = Backbone.Collection.extend({
  model: SignOutput
});

var signoutputcollection = new SignOutputCollection()

  var inputs=[]
  var outputs=[]




 $("tr").remove();
/////
cmd.get( "bitcoin-cli -testnet decoderawtransaction "+hextosend, function(err, data, stderr){ 


     for(var i=0;i<JSON.parse(data)["vin"].length;i++){
       var signinput = new SignInput({"txid": JSON.parse(data)["vin"][i]["txid"],"vout":JSON.parse(data)["vin"][i]["vout"]})
   signinputcollection.add(signinput)
     }

        for(var i=0;i<JSON.parse(data)["vout"].length;i++){
          var signoutput = new SignOutput({"address": JSON.parse(data)["vout"][i]["scriptPubKey"]["addresses"][0], "value":JSON.parse(data)["vout"][i]["value"]})
      signoutputcollection.add(signoutput)
     }
  

    // for(var i=0;i<signinputcollection.length;i++){
      

    // }

    if(signinputcollection.length>=signoutputcollection.length){
   for(var i=0;i<signinputcollection.length;i++){
       var obj =utxocollection.where({"txid": signinputcollection.models[i].get("txid"),"vout": signinputcollection.models[i].get("vout")})[0]
         
    console.log(obj)
        inputs.push(obj.get("address"))
        inputs.push(obj.get("amount") +"  BTC")
        outputs.push("")
        outputs.push("")
    }
   for(var i =0;i<signoutputcollection.length;i++){
      outputs[i*2] = signoutputcollection.models[i].get("address")
      outputs[i*2+1] =signoutputcollection.models[i].get("value")+" BTC"
      
   }

   

    }else{


       for(var i =0;i<signoutputcollection.length;i++){
    //  outputs[i] = signoutputcollection.models[i].get("address")+" "+signoutputcollection.models[i].get("value")+" BTC"
         outputs.push(signoutputcollection.models[i].get("address"))
         outputs.push(signoutputcollection.models[i].get("value")+" BTC")
    
     

       inputs.push("")
       inputs.push("")
   }   

     for(var i=0;i<signinputcollection.length;i++){
      var obj =utxocollection.where({"txid": signinputcollection.models[i].get("txid"),"vout": signinputcollection.models[i].get("vout")})[0]
         
    
      //  inputs[i]=obj.get("address")+ "   "+obj.get("amount") +"  BTC"
        inputs[i*2] =obj.get("address")
        inputs[i*2+1]=obj.get("amount") +"  BTC"
        
    }





    }

console.log(utxocollection)
console.log(signinputcollection)
console.log(signoutputcollection)
  


  // $("table").append("<tr><th>inputs</th><th><img src=\"arrow_right_green.png\" alt=\"Mountain View\"></th><th>outputs</th></tr>")
  // for(var i=0;i<inputs.length/2;i++){
  //   $("table").append(" <tr><th>"+ inputs[i]+"</th><th></th><th>"+ outputs[i]+"</th></tr>")


  // }
    $("table").append("<tr><th colspan=\"2\">inputs</th><th><img src=\"arrow_right_green.png\" alt=\"Mountain View\"></th><th colspan=\"2\">outputs</th></tr>")
  for(var i=0;i<inputs.length;i++){
    $("table").append(" <tr><th>"+ inputs[i]+"</th><th>"+ inputs[i+1]+"</th><th></th><th>"+ outputs[i]+"</th><th>"+ outputs[i+1]+"</th></tr>")
     i++

  }


  
//   console.log('the current working dir is : ',JSON.parse(data)["vin"][0]["txid"])
// console.log('the current working dir is : ',JSON.parse(data))
   } );

// for(var i=0;i<inputcollection.length;i++){

//   console.log(inputcollection.models[i].get)
// }

  // var inputs=["1MRtXgnoDApp3s6U87DzemqmVTYXJ2YFgQ (100 BTC)","1MRtXgnoDApp3s6U87DzemqmVTYXJ2YFgQ (100 BTC)","1MRtXgnoDApp3s6U87DzemqmVTYXJ2YFgQ (100 BTC)","1MRtXgnoDApp3s6U87DzemqmVTYXJ2YFgQ (100 BTC)"]
  // var outputs=["1PbjqnNAKL4VnQ1J4a3A2r4AzhG3XQjjSR (99.9995 BTC)","1PbjqnNAKL4VnQ1J4a3A2r4AzhG3XQjjSR (99.9995 BTC)","",""]
  
  
  // $("table").append("<tr><th>inputs</th><th><img src=\"arrow_right_green.png\" alt=\"Mountain View\"></th><th>outputs</th></tr>")
  // for(var i=0;i<inputs.length;i++){
  //   $("table").append(" <tr><th>"+ inputs[i]+"</th><th></th><th>"+ outputs[i]+"</th></tr>")


  // }

////






}


$("#listaddress").click(function () {





 $("ul").empty()
 
 $("#preview").hide()
 $("#displayqrcode").hide()
 $("table").hide()

var listaddressamountArray =[]
 


db.find({}, function (err, docs) {

  
for(var i=0;i<docs.length;i++){

console.log(utxocollection.where({"address":"99999"}))
 
  

  var listobjcollection =utxocollection.where({"address":docs[i]["address"]})
  // console.log(listobjcollection[0])
  var addresstotalamount =Decimal(0)

   if(listobjcollection.length>=1){


      for(var j=0;j<listobjcollection.length;j++){
        addresstotalamount=addresstotalamount.add(Decimal(listobjcollection[j].get("amount") ))
   }



   }else{


   }
   
   listaddressamountArray.push(docs[i]["address"]+"           "+addresstotalamount.toString())


}
})



setTimeout(function(){
  console.log(listaddressamountArray)
  for(var i=0;i<listaddressamountArray.length;i++){

    $("ul").append("<li>"+listaddressamountArray[i]+"</li>")
  }
},1100)

})




/////


function decodeqrcode(content){
  

   if(content[0]== "0" && content[1] =="0"){

    qrcodestr=content.slice(3)


return true



   }else if(parseInt(content[0]) >0 && parseInt(content[1]) >0){

         if(parseInt(content[0]) != parseInt(content[1])){
           
          qrcodearray[parseInt(content[1])-1] = content.slice(3)

         $("ul").append("<li>"+content[0]+"/"+content[1]+" ok </li>")

         }else if(parseInt(content[0]) == parseInt(content[1])){
             
            $("ul").append("<li>"+content[0]+"/"+content[1]+" ok </li>")
           qrcodearray[parseInt(content[1])-1] = content.slice(3)



              console.log(qrcodearray)

              for(var i=0;i<parseInt(content[1]);i++){ // shi zheli yingqi de wen ti


                qrcodestr = qrcodestr+qrcodearray[i]
              }
              
              console.log(qrcodestr)
                return true

         }else{


         }


   

   }else{


   }



return false


}


function encodeqrcode(str){
      

         var maxlength = 888
       qrcodearray=[]
      var count = Math.ceil(str.length/maxlength)

      
     console.log("str: "+str+"  count "+count)
      for(var i=0;i<count-1;i++){
        qrcodearray[i]=str.slice(0+i*maxlength,maxlength+i*maxlength)

      }
      qrcodearray[count-1]=str.slice((count-1)*maxlength)

console.log(qrcodearray)
     for(var i=0;i<qrcodearray.length;i++){

      $("ul").append("<li id="+count+(i+1)+" class=\"btn btn-primary btn-sm\">display  "+count+"/"+ (i+1)+ "</li>")
     }

$("#displayqrcode").show()

$("li").click(function(e){
  e.preventDefault();
      
    var liid = this.id;

console.log(liid)
      var  text= liid +" "+qrcodearray[parseInt(liid[1])-1]
       
           QRCode.toCanvas(canvas, text, function (error) {
    if (error) console.error(error)
    
  })

})



    
     
}








/////




var Utxo = Backbone.Model.extend({})

var UtxoCollection = Backbone.Collection.extend({
  model: Utxo
});

var utxocollection = new UtxoCollection()
utxocollection.comparator = function(utxo) {
  return -utxo.get("amount"); // Note the minus!
};


$("#refresh").click(function(){

$("ul").empty()
  var e = document.getElementById("selectnet");
var selectnet = e.options[e.selectedIndex].value;

if(selectnet == "livenet"){
network = Networks.livenet
  
}else if(selectnet == "testnet"){

network = Networks.testnet

}else{

}

   utxocollection.reset()
  addressArray.forEach(function(address) {
getUnspentUtxos(address)
})
})




setInterval(function(){ 
  
 var total = Decimal(0)

      utxocollection.sort()
     for(var i=0;i<utxocollection.length;i++){

     	total = total.add(Decimal(utxocollection.models[i].get("amount")))
     }
	$("#total").html("Total: "+total.toNumber()+" BTC")
},10000);



$("#btngetunsigndata").click(function(){

 $("#displayqrcode").hide()
 $("preview").hide()
 $("ul").empty()
 $('table').hide()

	var sendtoaddress =$("#sendtoaddress").val()
	var sendamount = $("#sendamount").val()
  var fee =Decimal($("#sendfee").val() || 0.0001 ) //zhe li keyi gaijing
  console.log(fee.toNumber())
	sendamount = Decimal(sendamount)
  
	var changeaddress =addressArray[0] //na di yige zuo wei changeaddress
	var unsigndata =""
  
	unsigndata = unsigndata+createUnsignData(sendtoaddress,sendamount,fee,changeaddress)

 

    console.log(sendtoaddress+  "   "+sendamount +"  "+changeaddress)
	
 // $("#displayunsigndata").html(unsigndata) // zhe li fen cheng ji bu fen



   encodeqrcode("u "+unsigndata)
//   QRCode.toCanvas(canvas, "u "+unsigndata, function (error) {
//   if (error) console.error(error)
//   console.log('success!');
// })
  
})




function openCamera(){
  Instascan.Camera.getCameras().then(function (cameras) {
    if (cameras.length > 0) {
      scanner.start(cameras[1]); // 0 wei qianzhi she xiang tou , 1 wei usb she xiang tou
    } else {
      console.error('No cameras found.');
    }
  }).catch(function (e) {
    console.error(e);
  });

}

function closeCamera(){

  scanner.stop()

}


function createUnsignData(sendtoaddress,sendamount,fee,changeaddress){



var unsigndata = "";
// var jine =sendamout
// var amount =sendamout
var sendamount1 = Decimal(sendamount)
var sendamount = Decimal(sendamount)
var count =Decimal(0);
var inputtotal =Decimal(0)
var fee = Decimal(fee)
var total = Decimal(0)
for(var i=0;i<utxocollection.length;i++){

      if(sendamount.add(fee).toNumber() <= utxocollection.models[i].get("amount")){

        // var input = new Input(utxocollection.models[i])
        // inputcollection.add(input)

         count =count.add(Decimal(1))
         total =total.add(Decimal(utxocollection.models[i].get("amount")))

        unsigndata=unsigndata+" "+utxocollection.models[i].get("txid")+" "+utxocollection.models[i].get("vout")+" "+utxocollection.models[i].get("address")+" "+utxocollection.models[i].get("scriptPubKey")+" "+utxocollection.models[i].get("amount")
         break
      }else{

        //      var input = new Input(utxocollection.models[i])
        // inputcollection.add(input)


  

        count =count.add(Decimal(1))
        unsigndata=unsigndata+" "+utxocollection.models[i].get("txid")+" "+utxocollection.models[i].get("vout")+" "+utxocollection.models[i].get("address")+" "+utxocollection.models[i].get("scriptPubKey")+" "+utxocollection.models[i].get("amount")
           
        sendamount= sendamount.sub(Decimal(utxocollection.models[i].get("amount")))
        total =total.add(Decimal(utxocollection.models[i].get("amount")))
            
      }

       
     }


    console.log("total "+total.toString()+"    sendamount1 "+sendamount1.toString())

    
  var hulue = total.sub(sendamount1).sub(fee).toNumber()
   if(isNaN(hulue) || hulue<=0.001){ // ke yi hu lue jin e
    
    return String.fromCharCode(count.toNumber()+96) +"1"+unsigndata +" "+sendtoaddress+" "+sendamount1

   }


    return String.fromCharCode(count.toNumber()+96) +"2"+unsigndata +" "+sendtoaddress+" "+sendamount1+ " "+changeaddress+ " "+ total.sub(sendamount1).sub(fee).toNumber()

}



// var a = Decimal(10.001)
// var b = Decimal(a)
// b++
// b++

// console.log(a.mul(b).toNumber())

// console.log(a.mul(b).sub(Decimal(100)).toNumber())


function getUnspentUtxos(address){
  var client = new explorers.Insight(network);
  client.getUnspentUtxos(address, function(err, utxos) {


   for(var i =0;i<utxos.length;i++){
    var utxo = new Utxo(utxos[i].toJSON());
    console.log(utxo)
     utxocollection.add(utxo)
   }
});

}


$('select').on('change', function() {
  $("#refresh").click()
})

$("#sendbitcoin").click(function(){
    
$.post( "https://test-insight.bitpay.com/api/tx/send", { rawtx: hextosend})
  .done(function( data ) {
    
    $("#refresh").click()
    console.log(" send ok "+ data['txid'])
  });

})
  



$("#signmessage").click(function(){
$("#signdiv").show()


})

$("#sign").click(function(){

var address = $("#address").val()
var unsignmessage = $("#unsignmessage").val()

var tosign = "m "+address+" "+unsignmessage
console.log(tosign)
encodeqrcode(tosign)

})