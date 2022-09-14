export default {
    getAllVariants: `
        SELECT v.id, title, group_concat(concat('{"id":', vo.id , ',"text":"', vo.text, '","price":', vo.price, '}')  SEPARATOR'|') as options FROM  variants v LEFT JOIN variant_options vo ON vo.itemVariantsId = v.id GROUP BY vo.itemVariantsId;
    `,
    addVariants: `
        INSERT INTO variants (id, title) VALUES (?, ?)
    `,
    getVariantById: `
        SELECT * FROM variants WHERE id=?
    `,
    deleteVariant: `
        UPDATE variants SET deleted=1 WHERE id=?
    `
}