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
    createAddressSchema: `
        CREATE TABLE IF NOT EXISTS address (
            id bigint PRIMARY KEY NOT NULL AUTO_INCREMENT,
            area varchar(50) NOT NULL,
            city varchar(50) NOT NULL,
            door_no varchar(20) NOT NULL,
            landmark varchar(100) DEFAULT NULL,
            pincode varchar(6) NOT NULL,
            state varchar(50) NOT NULL,
            street varchar(50) NOT NULL,
            contact_number varchar(10) NOT NULL,
            userId varchar(30) NOT NULL,
            foreign key (userId) references users(userId)
        );
    `,
    createItemsSchema: `
        CREATE TABLE IF NOT EXISTS items (
            itemId varchar(30) primary key,
            title varchar(60) not null,
            deleted bit(1) not null default 0,
            \`description\` varchar(200) not null,
            image varchar(255) not null,
            price float4 not null,
            creationDate timestamp not null default current_timestamp,
            modifiedDate timestamp not null default current_timestamp on update current_timestamp
        );
    `,
    createItemImagesSchema: `
        CREATE TABLE IF NOT EXISTS items_images (
            id bigint primary key auto_increment,
            url varchar(255) not null,
            itemId varchar(30) not null,
            foreign key (itemId) references items(itemId) on delete cascade on update cascade
        );
    `,
    createVariantsSchema: `
        CREATE TABLE IF NOT EXISTS variants (
            id varchar(30) primary key,
            title varchar(50) not null,
            creationDate timestamp not null default current_timestamp,
            modifiedDate timestamp not null default current_timestamp on update current_timestamp
        );
    `,
    createVariantOptionsSchema: `
        CREATE TABLE IF NOT EXISTS variant_options (
            id bigint primary key auto_increment,
            \`text\` varchar(50) not null,
            price float4 not null,
            itemVariantsId varchar(30) not null,
            foreign key (itemVariantsId) references variants(id)
        );
    `,
    createItemVariantsMappingSchema: `
        CREATE TABLE IF NOT EXISTS item_variants_mapping (
            id bigint primary key auto_increment,
            itemId varchar(30) not null,
            variantId varchar(30) not null,
            foreign key (itemId) references items(itemId),
            foreign key (variantId) references variants(id)
        );    
    `,
    creatOrdersSchema: `
        CREATE TABLE IF NOT EXISTS orders (
            orderId varchar(30) primary key,
            customerId varchar(30) not null,
            total float4 not null,
            orderStatus int not null,
            paymentType int not null,
            creationDate timestamp not null default current_timestamp,
            modifiedDate timestamp not null default current_timestamp on update current_timestamp,
            orderDate timestamp not null default current_timestamp,
            deliveryDate timestamp,
            deliveryAddress bigint not null,
            foreign key (deliveryAddress) references address(id),
            foreign key (customerId) references users(userId)
        );
    `,
    createItemQuantityMapperSchema: `
        CREATE TABLE IF NOT EXISTS item_quantity_mapper (
            id varchar(30) primary key,
            itemId varchar(30) not null,
            orderId varchar(30) not null,
            quantity int not null,
            foreign key (itemId) references items(itemId),
            foreign key (orderId) references orders(orderId)
        );
    `,
    createOptionsSelectedSchema: `
        CREATE TABLE IF NOT EXISTS item_options_selected (
            orderId varchar(30) not null,
            itemQuantityId varchar(30) not null,
            optionId bigint not null,
            foreign  key (orderId) references orders(orderId),
            foreign key (itemQuantityId) references item_quantity_mapper(id),
            foreign key (optionId) references variant_options(id)
        );
    `,
    createActionsSchema: `
        CREATE TABLE IF NOT EXISTS actions (
            id bigint not null primary key auto_increment,
            userId varchar(30) not null,
            actionType varchar(100) not null,
            orderId varchar(30),
            itemId varchar(30),
            variantId varchar(30),
            creationDate timestamp not null default current_timestamp,
            modifiedDate timestamp not null default current_timestamp on update current_timestamp,
            foreign key (userId) references users(userId),
            foreign key (orderId) references orders(orderId),
            foreign key (itemId) references items(itemId),
            foreign key (variantId) references variants(id)
        );        
    `,
}
