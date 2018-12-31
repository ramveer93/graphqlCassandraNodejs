const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID ,GraphQLInt,GraphQLList} = graphql;
const _ = require('lodash');
//define type, relationship, define root queries-> how user use initialy
var books = [
    { name: 'Name of the wind', genre: 'Fantasy', id: '1' ,authorId:'1'},
    { name: 'The Final Empire', genre: 'Fantasy', id: '2',authorId:'2' },
    { name: 'The long earth', genre: 'Sci-Fi', id: '3' ,authorId:'3'},
    { name: 'The pirates', genre: 'History', id: '4',authorId:'4' },
    { name: 'The geeta', genre: 'Religious', id: '5',authorId:'7' },
    { name: 'The kuran', genre: 'Religious', id: '6',authorId:'7' },
    { name: 'THe math', genre: 'Math', id: '7',authorId:'7' },
]

var authors = [
    { name: 'sandarson', age: 44, id: '1' },
    { name: 'alan border', age: 23, id: '2' },
    { name: 'sachin tenkudlark', age: 32, id: '3' },
    { name: 'kl rahul', age: 22, id: '4' },
    { name: 'vk kohli', age: 88, id: '5' },
    { name: 'll laxman', age: 22, id: '6' },
    { name: 'alan mith', age: 221, id: '7' },
]
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        //authorid:{type:GraphQLID},
        author:{
            type:AuthorType,
            resolve(parent,args){
                console.log(parent);
                return _.find(authors,{id:parent.authorId});
            }

        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        book:{
            type:new GraphQLList(BookType),
            resolve(parent,args){
                return _.filter(books,{authorId:parent.id})
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                /**
                 * code to get the data from db or other source
                 */
                return _.find(books, { id: args.id });
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return _.find(authors, { id: args.id });
            }
        },
        books:{
            type:new GraphQLList(BookType),
            resolve(parent,args){
                return books;
            }
        },
        authors:{
            type:new GraphQLList(AuthorType),
            resolve(parent,args){
                return authors;
            }
        }
    }
});


module.exports = new GraphQLSchema({
    query: RootQuery
});