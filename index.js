const fs = require('fs');
const parser = require('xml2json');
const csv = require('fast-csv');
const csvStream = csv.format({ headers: true, quote: '"' });
const csvOutputFile = fs.createWriteStream('csv/cfdi_data.csv');

const xmlDirPath = 'xml';

console.log("Reading files of xml folder...");
const xmlDir = fs.readdirSync(xmlDirPath);

let filePath;
let file;
let fileJSON;
let csvRow;
let arrayConceptos;

csvStream.pipe(csvOutputFile);

// Read xml dir to get the path of each files
xmlDir.forEach(fileName => {

    filePath = `${xmlDirPath}/${fileName}`;
    console.log(`Reading file: ${filePath}...`);

    // Read file content
    file = fs.readFileSync(filePath);

    fileJSON = JSON.parse(parser.toJson(file));

    // Percepciones
    console.log("Reading percepciones...");
    arrayConceptos = fileJSON['cfdi:Comprobante']['cfdi:Complemento']['nomina12:Nomina']['nomina12:Percepciones']['nomina12:Percepcion'];

    arrayConceptos.forEach(concepto => {

        // Create csvRow content
        csvRow = {
            comprobante: fileJSON['cfdi:Comprobante'].Folio,
            tipo_nomina: fileJSON['cfdi:Comprobante']['cfdi:Complemento']['nomina12:Nomina'].TipoNomina,
            fecha_pago: fileJSON['cfdi:Comprobante']['cfdi:Complemento']['nomina12:Nomina'].FechaPago,
            fecha_inicial_pago: fileJSON['cfdi:Comprobante']['cfdi:Complemento']['nomina12:Nomina'].FechaInicialPago,
            fecha_final_pago: fileJSON['cfdi:Comprobante']['cfdi:Complemento']['nomina12:Nomina'].FechaFinalPago,
            total_percepciones: fileJSON['cfdi:Comprobante']['cfdi:Complemento']['nomina12:Nomina'].TotalPercepciones,
            total_deducciones: fileJSON['cfdi:Comprobante']['cfdi:Complemento']['nomina12:Nomina'].TotalDeducciones,
            tipo_concepto: 'P',
            tipo_pd: concepto.TipoPercepcion,
            clave_pd: concepto.Clave,
            concepto_pd: concepto.Concepto,
            importe_pd: concepto.ImporteGravado
        };

        // Write csvRow
        csvStream.write(csvRow);
    });

    // Deducciones
    console.log("Reading deducciones...");
    arrayConceptos = fileJSON['cfdi:Comprobante']['cfdi:Complemento']['nomina12:Nomina']['nomina12:Deducciones']['nomina12:Deduccion'];

    arrayConceptos.forEach(concepto => {

        // Create csvRow content
        csvRow = {
            comprobante: fileJSON['cfdi:Comprobante'].Folio,
            tipo_nomina: fileJSON['cfdi:Comprobante']['cfdi:Complemento']['nomina12:Nomina'].TipoNomina,
            fecha_pago: fileJSON['cfdi:Comprobante']['cfdi:Complemento']['nomina12:Nomina'].FechaPago,
            fecha_inicial_pago: fileJSON['cfdi:Comprobante']['cfdi:Complemento']['nomina12:Nomina'].FechaInicialPago,
            fecha_final_pago: fileJSON['cfdi:Comprobante']['cfdi:Complemento']['nomina12:Nomina'].FechaFinalPago,
            total_percepciones: fileJSON['cfdi:Comprobante']['cfdi:Complemento']['nomina12:Nomina'].TotalPercepciones,
            total_deducciones: fileJSON['cfdi:Comprobante']['cfdi:Complemento']['nomina12:Nomina'].TotalDeducciones,
            tipo_concepto: 'D',
            tipo_pd: concepto.TipoDeduccion,
            clave_pd: concepto.Clave,
            concepto_pd: concepto.Concepto,
            importe_pd: concepto.Importe
        };

        // Write csvRow
        csvStream.write(csvRow);
    });

});

console.log("Process finished successfully...");
csvStream.end();