import { defineStore } from "pinia"
import { computed, ref } from "vue"
import { useFirestore, useCollection, useFirebaseStorage } from 'vuefire'
import { collection, addDoc, where, query, limit, orderBy, updateDoc, doc, getDoc, deleteDoc } from "firebase/firestore"
import { ref as sotrageRef } from "firebase/database"

export const useProductsStore = defineStore('products', () =>{

    const db = useFirestore()
    const sotrage = useFirebaseStorage()

    const selectCategory = ref(1)

    const categories = [
        {id: 1, name:'Sudaderas'},
        {id: 2, name:'Tenis'},
        {id: 3, name:'Lentes'}
    ]

    const q = query(
        collection(db, 'products'),
        orderBy('availability', 'asc')
    )

    const productsCollection = useCollection(q)

    async function createProduct(product){
       await addDoc(collection(db, 'products'), product)
    }

    async function updateProduct(docRef, product){
        const {image, ...values} = product
        if(image.length){
            await updateDoc(docRef, {
                ...values,
                image: image[0].name
            })
        }else{
            await updateDoc(docRef, values)
        } 
    }

    async function deleteProduct(id){
        if(confirm('¿Eliminar Producto?')){
            const docRef = doc(db, 'products', id)
            const docSnap = await getDoc(docRef)
            const product = docSnap.data()

           await Promise.all([
                deleteDoc(docRef)
           ])
        }
    }

    const categoryOptions = computed(() =>{
        const options = [
            {label: '--Seleccione--', value: '', attrs: {disabled: true}},
            ...categories.map(category => (
                {label: category.name, value: category.id}
            ))
        ]
        return options
    })

    const noResults = computed(() => productsCollection.value.length === 0)

    const filteredProducts = computed(() =>{
        return productsCollection.value
            .filter(product => product.category === selectCategory.value)
            .filter(product => product.availability > 0)
    })


    return{

        createProduct,
        updateProduct,
        deleteProduct,
        categories,
        selectCategory,
        noResults,
        filteredProducts,
        productsCollection,
        categoryOptions 

    }
})