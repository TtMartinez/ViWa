export default {
  name: 'product',
  title: 'Producto',
  type: 'document',
  fields: [
    {
      name: 'nombre',
      title: 'Nombre',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'precio',
      title: 'Precio ($)',
      type: 'number',
      validation: Rule => Rule.required().positive()
    },
    {
      name: 'imagen',
      title: 'Foto del producto',
      type: 'image',
      options: { hotspot: true },
      validation: Rule => Rule.required()
    },
    {
      name: 'categoria',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          { title: 'Jabones Herbales',    value: 'herbales'    },
          { title: 'Jabones Cremosos',    value: 'cremosos'    },
          { title: 'Exfoliantes & Detox', value: 'exfoliantes' },
          { title: 'Bálsamos',            value: 'balsamos'    },
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'descripcion',
      title: 'Descripción (opcional)',
      type: 'text'
    }
  ]
}