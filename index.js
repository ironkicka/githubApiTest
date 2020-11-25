require('dotenv').config();
const { Octokit } = require("@octokit/core");
const token = process.env.API_KEY;
const owner = process.env.OWNER;
const repo = process.env.REPO;
const pathToTarget = process.env.PATH_TO_TARGET;
const octokit = new Octokit({ auth: token });


// ********** commit 取得 ************
const getCommits = (responseDataArray)=>{
    let count=0;
    let commits = [];
    //commitオブジェクトの配列の配列になっているので一旦flatにする
    responseDataArray.forEach(data =>{
        // data.commit.author.dateはコミットの時刻ではない．
        // data.commit.committer.dateをとるべし
        const date = new Date(`${data.commit.committer.date}`);
        console.log(`${date}/ ${data.commit.author.name}:${data.commit.message.trim()}`)
        commits.push({id:data.sha,url:data.html_url,info:data.commit})
        count ++;
    })
    console.log(`${count}コミット`)
    return commits;
}

const toISO8601String = (dateString)=>{
    const strArr = dateString.split(' ')
    const result = strArr[0]+'T'+strArr[1]+'+09:00'
    return result
}

const getAWeekAgoISO8601StringJST = ()=>{
    const date = new Date()
    date.setDate(date.getDate()-7)
    const aWeekAgo = date.toLocaleString()
    const result = toISO8601String(aWeekAgo)
    return result;
}

const aWeekAgo = getAWeekAgoISO8601StringJST();

// (async ()=> {
//         let resultArr = [];
//         let next_url;
//         let api_limit_remaining;
//         await octokit.request(`GET /repos/${owner}/${repo}/commits`, {
//             since: aWeekAgo,
//             //sha: "feat_4353",//"develop",指定しない場合、masterのみを見ることになる。
//             path:"client_web/shared",
//             per_page: 50
//         }).then((res) => {
//             resultArr = res.data
//             api_limit_remaining = res.headers["x-ratelimit-remaining"]
//             console.log(res.headers.link)
//             const matches = /\<([^<>]+)\>; rel\="next"/.exec(res.headers.link);
//             if (matches != null) {
//                 console.log("matches1", matches)
//                 next_url = matches[1]
//             } else {
//                 console.log("次のURLがありません")
//                 next_url = null;
//                 return;
//             }
//         }).catch((err) => {
//             console.log(err)
//         })
//         while (next_url !== null) {
//             await octokit.request(`${next_url}`, {}).then((res) => {
//                 resultArr.push(res.data)
//                 api_limit_remaining = res.headers["x-ratelimit-remaining"];
//                 console.log(res.headers.link)
//                 const matches = /\<([^<>]+)\>; rel\="next"/.exec(res.headers.link);
//                 if (matches != null) {
//                     console.log("matches2", matches)
//                     next_url = matches[1]
//                 } else {
//                     console.log("次のURLがありません")
//                     next_url = null;
//                 }
//             }).catch((err) => {
//                 console.log(err)
//             })
//         }
//         console.log(resultArr)
//         //getCommits(resultArr);
//         console.log("x-ratelimit-remaining",api_limit_remaining)
//     }
// )();
// ********** commit 取得 ここまで************

// ********** branch 取得 ***********
(async ()=> {
        let resultArr =new Array();
        let next_url;
        let api_limit_remaining;
        await octokit.request(`GET /repos/${owner}/${repo}/branches`, {
            path:"client_web/shared",
            per_page: 50
        }).then((res) => {
            resultArr.push(res.data)
            api_limit_remaining = res.headers["x-ratelimit-remaining"]
            //console.log(res.headers.link)
            const matches = /\<([^<>]+)\>; rel\="next"/.exec(res.headers.link);
            if (matches != null) {
                //console.log("matches1", matches)
                next_url = matches[1]
            } else {
                console.log("次のURLがありません")
                next_url = null;
                return;
            }
        }).catch((err) => {
            console.log(err)
        })
        while (next_url !== null) {
            await octokit.request(`${next_url}`, {}).then((res) => {
                resultArr.push(res.data)
                api_limit_remaining = res.headers["x-ratelimit-remaining"];
                //console.log(res.headers.link)
                const matches = /\<([^<>]+)\>; rel\="next"/.exec(res.headers.link);
                if (matches != null) {
                    //console.log("matches2", matches)
                    next_url = matches[1]
                } else {
                    console.log("次のURLがありません")
                    next_url = null;
                }
            }).catch((err) => {
                console.log(err)
            })
        }
        const result = [].concat.apply([],resultArr);
        console.log(result.length);
        console.log("x-ratelimit-remaining",api_limit_remaining)
    }
)();


    // let neededInfo = [];
    // for(let commit of commits){
    //     await octokit.request(`GET /repos/${owner}/${repo}/commits/${commit.id}`,{
    //     }).then(res=>{
    //         //console.log(res.data)
    //         const result = res.data
    //         const changed_files = result.files;
    //         const changedSharedFileNames = changed_files.filter(file => file.filename.startsWith(pathToTarget))
    //         //console.log(changedSharedFileNames)
    //         if(changedSharedFileNames.length > 0){
    //             let filenames =[]
    //             changedSharedFileNames.forEach(file =>{
    //                 filenames.push(file.filename)
    //             })
    //             //console.log(filenames)
    //             neededInfo.push({author:commit.info.author,message:commit.info.message,url:commit.url});
    //         }
    //         //console.log(neededInfo)
    //     }).catch(err=>{
    //         console.log(err)
    //     })
    // }


    //console.log(neededInfo)

    // const testFunc = async () => {
    //     await Promise.all(commits.map(async commit => await octokit.request(`GET /repos/${owner}/${repo}/commits/${commit.id}`,{
    //     }).then(res=>{
    //         //console.log(res.data)
    //         const result = res.data
    //         const changed_files = result.files;
    //         const changedSharedFileNames = changed_files.filter(file => file.filename.startsWith(pathToTarget))
    //         //console.log(changedSharedFileNames)
    //         if(changedSharedFileNames.length > 0){
    //             let filenames =[]
    //             changedSharedFileNames.forEach(file =>{
    //                 filenames.push(file.filename)
    //             })
    //             //console.log(filenames)
    //             neededInfo.push({author:commit.info.author,message:commit.info.message,url:commit.info.url,filenames:filenames});
    //         }
    //         //console.log(neededInfo)
    //     }).catch(err=>{
    //         console.log(err)
    //     })))
    //     console.log('done!')
    // };
    // testFunc();
    // commits.forEach(commit =>{
    //     (async ()=>{
    //         await octokit.request(`GET /repos/${owner}/${repo}/commits/${commit.id}`,{
    //         }).then(res=>{
    //             //console.log(res.data)
    //             const result = res.data
    //             const changed_files = result.files;
    //             const changedSharedFileNames = changed_files.filter(file => file.filename.startsWith('pathToTarget'))
    //             //console.log(changedSharedFileNames)
    //             if(changedSharedFileNames.length > 0){
    //                 let filenames =[]
    //                 changedSharedFileNames.forEach(file =>{
    //                     filenames.push(file.filename)
    //                 })
    //                 //console.log(filenames)
    //                 neededInfo.push({author:commit.info.author,message:commit.info.message,url:commit.info.url,filenames:filenames});
    //             }
    //             //console.log(neededInfo)
    //         }).catch(err=>{
    //             console.log(err)
    //         })
    //     })();
    //     console.log(neededInfo)
    // })

    // await octokit.request("GET /repos/${owner}/${repo}/commits", {
    //     author: "ironkicka",
    // }).then((res)=>{
    //     console.log(res)
    // }).catch((err)=>{
    //     console.log(err)
    // })


    //date.setTime(date.getTime() + 1000*60*60*9);// JSTに変換

