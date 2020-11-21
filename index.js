require('dotenv').config();
const { Octokit } = require("@octokit/core");
const token = process.env.API_KEY;
const owner = process.env.OWNER;
const repo = process.env.REPO;
const pathToTarget = process.env.PATH_TO_TARGET;

const octokit = new Octokit({ auth: token });

(async ()=>{
    let resultArr=[];
    await octokit.request(`GET /repos/${owner}/${repo}/commits`, {
        since: "2020-11-16T00:00:00Z",
        sha:"develop",
        page:5,
        per_page:10
    }).then((res)=>{
        resultArr = res.data
        console.log(res)
    }).catch((err)=>{
        console.log(err)
    })
    let commits = [];
    let count=0;
    resultArr.forEach(commit =>{
        //console.log(`${commit.commit.author.date}/ ${commit.commit.author.name}:${commit.commit.message.trim()}`)
        //console.log(commit)
        commits.push({id:commit.sha,url:commit.html_url,info:commit.commit})
        count ++;
    })
    //console.log(resultArr)
    console.log(count)
    let neededInfo = [];
    for(let commit of commits){
        await octokit.request(`GET /repos/${owner}/${repo}/commits/${commit.id}`,{
        }).then(res=>{
            //console.log(res.data)
            const result = res.data
            const changed_files = result.files;
            const changedSharedFileNames = changed_files.filter(file => file.filename.startsWith(pathToTarget))
            //console.log(changedSharedFileNames)
            if(changedSharedFileNames.length > 0){
                let filenames =[]
                changedSharedFileNames.forEach(file =>{
                    filenames.push(file.filename)
                })
                //console.log(filenames)
                neededInfo.push({author:commit.info.author,message:commit.info.message,url:commit.url});
            }
            //console.log(neededInfo)
        }).catch(err=>{
            console.log(err)
        })
    }
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

})();
