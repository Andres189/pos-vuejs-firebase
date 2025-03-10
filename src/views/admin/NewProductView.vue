<script setup>
    import { ref, computed, reactive } from 'vue'
    import Link from '@/components/Link.vue'
    import { useProductsStore } from '@/stores/products'
    import { useRouter } from 'vue-router'

    const image=ref()
    const products = useProductsStore()
    const router = useRouter()

    const formData= reactive({
        name: '',
        category: '',
        price: '',
        availability: '',
        image: ''

    })

    const onFileChange = (e) =>{
        image.value ="/src/img/" + e.target.files[0].name

        console.log(image.value)
    }

    const isImageUploaded = computed(() =>{
        return image.value ? image.value : null
    })

    const submitHandler= async (data) =>{
        
        const {image, ...values} = data

        try {
            await products.createProduct({
            ...values,
            image: data.image[0].name
            })
            router.push({name: 'products'})
        } catch (error) {
            console.log(error)
        }
    }
;
</script>

<template>
    <div>
        <Link
            to="products"
        >Volver</Link>

        <h1 class="text-4xl font-black my-10">Nuevo Producto</h1>

        <div class="flex justify-center bg-white shadow">
            <div class="mt-10 p-10 w-full 2xl:w-2/4">

                <FormKit
                    type="form"
                    submit-label="Agregar Producto"
                    incomplete-message="No se puedo enviar, revisa los mensajes"
                    @submit="submitHandler"
                    :value="formData"
                >
                    <FormKit
                        type="text"
                        label="Nombre"
                        name="name"
                        placeholder="Nombre del producto"
                        validation="required"
                        :validation-messages="{required: 'El Nombre del Producto es Obligatorio'}"
                        v-model.trim="formData.name"
                    />

                    <FormKit
                        type="file"
                        label="Imagen producto"
                        name="image"
                        validation="required"
                        :validation-messages="{required: 'La imagen del producto es obligatoria'}"
                        accept=".jpg"
                        @change="onFileChange"
                        v-model.trim="formData.image"
                    />

                    <div v-if="isImageUploaded">
                        <p class="font-black">Imagen Producto:</p>
                        <img 
                            :src="isImageUploaded" 
                            alt="imagen producto"
                            class="w-32"
                        />
                    </div>

                    <FormKit
                        type="select"
                        label="Categoria"
                        name="category"
                        validation="required"
                        :validation-messages="{required: 'La categoria es obligatoria'}"
                        :options="products.categoryOptions"
                        v-model.number="formData.category"
                    />

                    <FormKit
                        type="number"
                        label="Precio"
                        name="price"
                        placeholder="Precio del Producto"
                        validation="required"
                        :validation-messages="{required: 'El precio es obligatorio'}"
                        min="1"
                        v-model.number="formData.price"
                    />

                    <FormKit
                        type="number"
                        label="Disponibles"
                        name="availability"
                        placeholder="Cantidad Disponible"
                        validation="required"
                        :validation-messages="{required: 'La cantidad es obligatoria'}"
                        min="1"
                        v-model.number="formData.availability"
                    />
                </FormKit>

            </div>
        </div>

        
    </div>
</template>


