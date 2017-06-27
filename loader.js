let loader = (function(){
    let queue = [];

    /**
     * promise callbacks
     */
    let afterPromiseStruct = function(method, label) {
        this.afterMethod = method;
        this.afterLabel = label;
    };

    let afterPromises = [];

    var fs = new (function() {
        this.readFile = (file_location,callback) => {
            var request = new XMLHttpRequest();
            request.open("GET", file_location, true);
            request.send();
            request.onreadystatechange = function () {
                if (request.readyState == 4) {
                    queue.shift();
                    callback(null, request.responseText);
                    for(let x = 0 ; x < afterPromises.length; x++) {
                        if(afterPromises[x].afterLabel == file_location) {
                            afterPromises[x].afterMethod();
                        }
                    }
                }
            }
        }
    })();

    var basepath = "../../";
    console.log("browser based");

    let loader = function() {
        /**
        *  @param destination the id of where you want the
         * @param filename the name of the file you want to use
         * @param firstIter for internal use only. -don't set it manually!!- it's only here because i'm too lazy to make a struct
         */
        this.loadView = function (destination, filename, firstIter = true){
            //keep track of the filename that is trying to be loaded (for promises)
            this.filename = filename;
            if(firstIter){
                queue.push(filename);
            }
            if(queue.indexOf(filename) != 0){
                //this is not at the front of the queue
                //keep checking until it is first in the queue
                setTimeout(()=>{this.loadView(destination,filename,false)},0);
            } else {
                //the queue is already empty
                let data = fs.readFile(basepath + "mvc/views/" + filename + ".html", (err, data) => {
                    destination.innerHTML += data;
                });
            }
            return this;
        }

        //used for promises
        this.filename = null;

        /**
         * use to set the after promise callback
         */
        this.after = (callback) => {
            afterPromises.push(new afterPromiseStruct(callback, basepath + "mvc/views/" + this.filename + ".html"));
        }
    }
    return new loader();
})();


