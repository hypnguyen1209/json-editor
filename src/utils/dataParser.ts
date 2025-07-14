import * as yaml from 'js-yaml'
import Papa from 'papaparse'
import * as xml2js from 'xml2js'
import TOML from '@ltd/j-toml'

export type DataFormat = 'json' | 'yaml' | 'csv' | 'xml' | 'toml'

export function parseData(data: string, format: DataFormat): any {
    if (!data.trim()) {
        throw new Error('No data provided')
    }

    try {
        switch (format) {
            case 'json':
                return JSON.parse(data)

            case 'yaml':
                return yaml.load(data)

            case 'csv':
                const csvResult = Papa.parse(data, {
                    header: true,
                    skipEmptyLines: true,
                    transformHeader: (header: string) => header.trim(),
                    transform: (value: string) => {
                        // Try to parse numbers and booleans
                        if (value === 'true') return true
                        if (value === 'false') return false
                        if (value === 'null' || value === '') return null

                        const num = Number(value)
                        if (!isNaN(num) && isFinite(num)) return num

                        return value
                    }
                })

                if (csvResult.errors.length > 0) {
                    throw new Error(`CSV parse error: ${csvResult.errors[0].message}`)
                }

                return csvResult.data

            case 'xml':
                let xmlResult: any
                xml2js.parseString(data, {
                    explicitArray: false,
                    ignoreAttrs: false,
                    mergeAttrs: true,
                    trim: true
                }, (err, result) => {
                    if (err) {
                        throw new Error(`XML parse error: ${err.message}`)
                    }
                    xmlResult = result
                })
                return xmlResult

            case 'toml':
                return TOML.parse(data)

            default:
                throw new Error(`Unsupported format: ${format}`)
        }
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`${format.toUpperCase()} parse error: ${error.message}`)
        }
        throw new Error(`${format.toUpperCase()} parse error: Unknown error`)
    }
}

export function formatData(data: string, format: DataFormat): string {
    try {
        const parsed = parseData(data, format)
        return formatParsedData(parsed, format)
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Format error: ${error.message}`)
        }
        throw new Error('Format error: Unknown error')
    }
}

export function formatParsedData(parsed: any, format: DataFormat): string {
    try {
        switch (format) {
            case 'json':
                return JSON.stringify(parsed, null, 2)

            case 'yaml':
                return yaml.dump(parsed, {
                    indent: 2,
                    lineWidth: 120,
                    noRefs: true
                })

            case 'csv':
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return Papa.unparse(parsed, {
                        header: true,
                        skipEmptyLines: true
                    })
                }
                throw new Error('CSV data must be an array of objects')

            case 'xml':
                const builder = new xml2js.Builder({
                    renderOpts: { pretty: true, indent: '  ' }
                })
                return builder.buildObject(parsed)

            case 'toml':
                return TOML.stringify(parsed, { newline: '\n', indent: '  ' })

            default:
                throw new Error(`Unsupported format: ${format}`)
        }
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Format error: ${error.message}`)
        }
        throw new Error('Format error: Unknown error')
    }
}

export function convertData(data: string, fromFormat: DataFormat, toFormat: DataFormat): string {
    if (fromFormat === toFormat) {
        return formatData(data, fromFormat)
    }

    const parsed = parseData(data, fromFormat)

    switch (toFormat) {
        case 'json':
            return JSON.stringify(parsed, null, 2)

        case 'yaml':
            return yaml.dump(parsed, {
                indent: 2,
                lineWidth: 120,
                noRefs: true
            })

        case 'csv':
            if (Array.isArray(parsed) && parsed.length > 0) {
                return Papa.unparse(parsed, {
                    header: true,
                    skipEmptyLines: true
                })
            }
            // If not an array, try to convert object properties to CSV
            if (typeof parsed === 'object' && parsed !== null) {
                const entries = Object.entries(parsed).map(([key, value]) => ({
                    key,
                    value: typeof value === 'object' ? JSON.stringify(value) : String(value)
                }))
                return Papa.unparse(entries, { header: true })
            }
            throw new Error('Cannot convert to CSV: Data must be an array or object')

        case 'xml':
            const builder = new xml2js.Builder({
                renderOpts: { pretty: true, indent: '  ' },
                rootName: 'root'
            })
            return builder.buildObject(parsed)

        case 'toml':
            return TOML.stringify(parsed, { newline: '\n', indent: '  ' })

        default:
            throw new Error(`Unsupported target format: ${toFormat}`)
    }
}

export function validateData(data: string, format: DataFormat): { isValid: boolean; errors: string[] } {
    try {
        parseData(data, format)
        return { isValid: true, errors: [] }
    } catch (error) {
        return {
            isValid: false,
            errors: [error instanceof Error ? error.message : 'Validation error']
        }
    }
}
