import html2canvas from 'html2canvas'
import { saveAs } from 'file-saver'

export async function exportAsImage(element: HTMLElement, filename: string = 'visualization'): Promise<void> {
    try {
        // Configure html2canvas options for better quality
        const canvas = await html2canvas(element, {
            backgroundColor: '#ffffff',
            scale: 2, // Higher resolution
            useCORS: true,
            allowTaint: false,
            logging: false,
            width: element.scrollWidth,
            height: element.scrollHeight
        })

        // Convert canvas to blob and download
        canvas.toBlob((blob) => {
            if (blob) {
                saveAs(blob, `${filename}.png`)
            }
        }, 'image/png')
    } catch (error) {
        console.error('Export failed:', error)
        throw new Error('Failed to export image')
    }
}

export async function exportAsJPEG(element: HTMLElement, filename: string = 'visualization'): Promise<void> {
    try {
        const canvas = await html2canvas(element, {
            backgroundColor: '#ffffff',
            scale: 2,
            useCORS: true,
            allowTaint: false,
            logging: false
        })

        canvas.toBlob((blob) => {
            if (blob) {
                saveAs(blob, `${filename}.jpg`)
            }
        }, 'image/jpeg', 0.9)
    } catch (error) {
        console.error('JPEG export failed:', error)
        throw new Error('Failed to export JPEG image')
    }
}

export async function exportAsSVG(svgElement: SVGElement, filename: string = 'visualization'): Promise<void> {
    try {
        // Get SVG source
        const serializer = new XMLSerializer()
        const svgString = serializer.serializeToString(svgElement)

        // Create blob and download
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
        saveAs(blob, `${filename}.svg`)
    } catch (error) {
        console.error('SVG export failed:', error)
        throw new Error('Failed to export SVG')
    }
}

export function downloadJSON(data: any, filename: string = 'data'): void {
    try {
        const jsonString = JSON.stringify(data, null, 2)
        const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' })
        saveAs(blob, `${filename}.json`)
    } catch (error) {
        console.error('JSON download failed:', error)
        throw new Error('Failed to download JSON')
    }
}

export function downloadText(text: string, filename: string, mimeType: string = 'text/plain'): void {
    try {
        const blob = new Blob([text], { type: `${mimeType};charset=utf-8` })
        saveAs(blob, filename)
    } catch (error) {
        console.error('Text download failed:', error)
        throw new Error('Failed to download file')
    }
}
