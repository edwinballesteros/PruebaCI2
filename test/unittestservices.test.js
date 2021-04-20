const cds = require('@sap/cds')

describe('Ejemplo: OData Protocol Level Testing', () => { //Nombre de la prueba
  const app = require('express')()
  const request = require('supertest')(app)

  beforeAll(async () => {
    await cds.deploy(__dirname + '/../srv/interactions_srv').to('sqlite::memory:')
    await cds.serve('CatalogService').from(__dirname + '/../srv/interactions_srv').in(app)
  })
  it('Ejemplo de Service $metadata document', async () => { //Secciones de la prueba
    const response = await request
      .get('/catalog/$metadata')//Acá se debe tener cuidado con el path del servicio 
      .expect('Content-Type', /^application\/xml/)
      .expect(200)

    const expectedVersion = '<edmx:Edmx Version="4.0" xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx">'
    const expectedBooksEntitySet = '<EntitySet Name="Interactions_Header" EntityType="CatalogService.Interactions_Header">'
    expect(response.text.includes(expectedVersion)).toBeTruthy()
    expect(response.text.includes(expectedBooksEntitySet)).toBeTruthy()
  })
  })