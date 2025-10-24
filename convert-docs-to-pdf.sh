#!/bin/bash

echo "🔄 Convirtiendo documentación a PDF..."

# Verificar si existe la carpeta docs
if [ ! -d "docs" ]; then
  echo "❌ Error: No se encontró la carpeta docs/"
  exit 1
fi

# Verificar si md-to-pdf está instalado
if command -v md-to-pdf &> /dev/null; then
  echo "✅ Usando md-to-pdf"

  cd docs
  md-to-pdf *.md

  echo "✅ Conversión completa!"
  echo "📁 PDFs generados en: docs/"
  ls -lh *.pdf

# Verificar si pandoc está instalado
elif command -v pandoc &> /dev/null; then
  echo "✅ Usando pandoc"

  for file in docs/*.md; do
    filename=$(basename "$file" .md)
    echo "   Convirtiendo $filename.md..."
    pandoc "$file" -o "docs/$filename.pdf"
  done

  echo "✅ Conversión completa!"
  echo "📁 PDFs generados en: docs/"
  ls -lh docs/*.pdf

else
  echo "❌ No se encontró md-to-pdf ni pandoc"
  echo ""
  echo "Instala una de estas opciones:"
  echo ""
  echo "  Opción 1 - md-to-pdf (recomendado):"
  echo "  bun add -g md-to-pdf"
  echo ""
  echo "  Opción 2 - pandoc:"
  echo "  brew install pandoc"
  echo ""
  exit 1
fi
