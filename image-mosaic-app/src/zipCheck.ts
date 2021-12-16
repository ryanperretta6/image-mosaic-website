function zipCheck(fileType: string):boolean{
    let arr: string[] = fileType.split("/");
    let prefix: string = arr[0];
    let suffix: string = arr[1];

    if(prefix !== "application")
        return false;
    if(suffix !== "")
        return false;
    return true;
}

export default zipCheck;