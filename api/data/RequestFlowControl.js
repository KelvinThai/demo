const fs = require('fs');
const fspath = '../flowcontrol.conf';

class RequestFlowControl {
    //size: number of asyn request
    //limit: limit time per request in milisecond
    //timeout: response time out in milisecond
    constructor(size, limit, timeout, processName = 'main') {

        this.limit = limit;
        this.timeout = timeout;
        this.current = -1;
        this.size = size;
        this.status_pool = Array.apply(null, Array(this.size));
        this.lasttime_pool = Array.apply(null, Array(this.size));
        this.isrelease = false;
        //this.process = [];
        //this.processSize = size;
        this.currents = [];
        if (processName !== undefined) {
            this.processName = processName;
            Promise.all([this.register(this.processName)]);;
        }
        this.checkSizeInterval =  setInterval(() => { this.checkSize(this.processName); }, 1000);
    }

    getToken() {
        let now = new Date();
        let out = new Date(now.getTime() - this.timeout);
        for (let i = 0; i < this.size; i++) {
            this.current = this.current + 1;
            if (this.current >= this.size)
                this.current = 0;

            if (this.lasttime_pool[this.current] == undefined || this.lasttime_pool[this.current] < out || this.status_pool[this.current] == true) {
                this.lasttime_pool[this.current] = now;
                this.status_pool[this.current] = false;
                console.log(new Date().toISOString() + " getToken:" + this.current);
                return { lasttime: now, index: this.current };

            }

        }
        return null;
    }

    getTokenAsync = async() => {
        return await new Promise(resolve => {
            let token = this.getToken();
            if(token){
                resolve(token);
                return;
            }
            const interval = setInterval(() => {
              let token = this.getToken();
              if (token) {
                resolve(token);
                clearInterval(interval);
              };
            }, 100);
          });
    }
    
    async releaseToken(item) {
        if (this.lasttime_pool[item.index] == item.lasttime) {
            let period = new Date().getTime() - this.lasttime_pool[item.index].getTime();
            let time = ((this.limit - period) > 0 ? (this.limit - period) : 0);
            if (time > 0)
                await this.delay(time);
            this.status_pool[item.index] = true;
            this.lasttime_pool[item.index] = new Date();
            console.log(new Date().toISOString() + " releaseToken: " + item.index + " : " + this.status_pool[item.index]);
        }
    }

    async delay(time) {
        return new Promise(resolve => setTimeout(resolve, time))
    }
    /*
        addProcess(name) {
            if (this.process.indexOf(name) == -1) {
                this.process.push(name);
                this.processSize = parseInt(this.size / this.process.length);
                this.currents.push(-1);
            }
        }
    
        removeProcess(name) {
    
            this.process = this.process.filter(q => q != name);
        }
    
        getProcessToken(name) {
            let index = this.process.indexOf(name);
            if (index == -1) index = 0;
            let min = this.processSize * index;
            let max = index == (this.process.length - 1) ? this.size : min + this.processSize;
    
            let now = new Date();
            let out = new Date(now.getTime() - this.timeout);
            if (this.current[index] < min || this.current[index] > max) {
                this.current[index] = min;
            }
            for (let i = min; i < max; i++) {
                let idx = this.current[index] + 1;
                if (idx >= max)
                    idx = min;
                this.current[index] = idx;
    
                if (this.lasttime_pool[idx] == undefined || this.lasttime_pool[idx] < out || this.status_pool[idx] == true) {
                    this.lasttime_pool[idx] = now;
                    this.status_pool[idx] = false;
                    console.log(`${new Date().toISOString()} ${name} getToken: ${idx}`);
                    return { lasttime: now, index: idx };
    
                }
    
            }
            return null;
        }
    */
    checkSize(name) {
        try {
            let data = JSON.parse(fs.readFileSync(fspath, 'utf8'));
            if (data.processSize !== undefined && data.processSize != this.size) {
                this.size = data.processSize;
            }
            if (data.process.indexOf(name) == -1) {
                this.register(name);
            }
            //console.log(`${name} check size ${this.size} ${new Date().toISOString()}`);
        } catch (ex) {
            console.log(`${name} check size ${new Date().toISOString()}: ${ex}`);
        }
    }

    async register(name) {
        try {
            if (fs.existsSync(fspath)) {
                let data = JSON.parse(fs.readFileSync(fspath, 'utf8'));
                if (data.process.indexOf(name) == -1) {
                    data.process.push(name);
                    data.processSize = parseInt(data.size / data.process.length);
                    fs.writeFileSync(fspath, JSON.stringify(data));
                }
            }
            else {
                let data = {};
                data.size = this.size;
                data.process = [];
                data.process.push(name);
                data.processSize = parseInt(data.size / data.process.length);
                fs.writeFileSync(fspath, JSON.stringify(data));
            }
            await this.delay(2000);
            //console.log(`${name} register ${new Date().toISOString()}`);
        } catch(ex) { }
    }

    release() {
        try {
            clearInterval(this.checkSizeInterval);
            if (fs.existsSync(fspath)) {
                let data = JSON.parse(fs.readFileSync(fspath, 'utf8'));
                if (data.process.indexOf(this.processName) !== -1) {
                    data.process = data.process.filter(q => q != this.processName);
                    if (data.process.length == 0) {
                        data.processSize = data.size;
                    }
                    else
                        data.processSize = parseInt(data.size / data.process.length);
                    fs.writeFileSync(fspath, JSON.stringify(data));
                }
            }
            //console.log(`${this.processName} release ${new Date().toISOString()}`);
        } catch (ex) {
            console.log(`${this.processName} release ${new Date().toISOString()}: ${ex}`);
        }
    }
}
exports.RequestFlowControl = RequestFlowControl;