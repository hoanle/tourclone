const mongose = require('mongoose')

const tagScheme = mongose.Schema({
    tag : { 
        type: String,
        required: [true, "Tag must have a name"],
        unique: true
    }
})
tagScheme.statics.generateTags = async (tags) => {
    const lowerCaseTag = tags.map(x => x.toLowerCase().trim());
    const tagIds = lowerCaseTag.map(async t => {
        let tag = await Tag.findOne({ tag: t});
        if (tag) return tag;
        tag = await Tag.create({ tag: t });
        return tag
    })
    const results = Promise.all(tagIds)
    return results;
}

tagScheme.methods.toJSON = function () {
    const tag = this;
    const tagObject = tag.toObject();
    delete tagObject.__v;
    return tagObject
}

const Tag = mongose. model("Tag", tagScheme);
module.exports = Tag