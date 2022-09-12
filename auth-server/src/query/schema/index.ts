export default {
    createUserSchema: `
        CREATE TABLE IF NOT EXISTS users (
            userId varchar(30) primary key, 
            username varchar(25) not null, 
            \`password\` varchar(150) not null, 
            creationDate timestamp not null default current_timestamp, 
            modifiedDate timestamp not null default current_timestamp on update current_timestamp, 
            lastLogin timestamp,  
            \`role\` varchar(20) not null, 
            email varchar(50) not null, 
            mobile_number varchar(10) not null, 
            account_active bit(1) not null default 1,  
            email_verified bit(1) not null default 0
        );
    `,
}
