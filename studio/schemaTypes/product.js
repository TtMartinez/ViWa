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
          { title: 'Jabones Exfoliantes & Detox', value: 'exfoliantes' },
          { title: 'Bálsamos & Exfoliantes',            value: 'balsamos'    },
          { title: 'Gel de ducha',            value: 'gelducha'    },
          { title: 'Rituales',            value: 'rituales'    },
          { title: 'Sales de baño',            value: 'salesbaño'    },
          { title: 'Textiles',            value: 'textiles'    },
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