import bcrypt from 'bcryptjs';

const crieHash = (password: string):string => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

const compareHash = (iptpass: string, dbhash: string):boolean => {
    return bcrypt.compareSync(iptpass, dbhash);
}


export {crieHash, compareHash};