#!/bin/bash

# Production Build Script for Sensor UI
# This script builds the clean production version and sets up files for both C# integration and preview

echo "🚀 Building production version..."

# Run TypeScript compilation and Vite build
npm run build:prod

echo "✅ Production build complete!"
echo ""
echo "📁 Generated files:"
echo "   - dist-prod/index.prod.html (for C# integration)"
echo "   - dist-prod/index.html (for preview server)"
echo "   - dist-prod/headlogo.svg (logo file)"
echo ""
echo "🔧 For C# integration:"
echo "   Copy dist-prod/index.prod.html to your C# project"
echo ""
echo "👀 To preview:"
echo "   npm run preview:prod"
echo ""
echo "📊 File sizes:"
ls -lh dist-prod/index.prod.html | awk '{print "   - Production HTML: " $5}'
ls -lh dist-prod/headlogo.svg | awk '{print "   - Logo SVG: " $5}'

echo ""
echo "🎉 Production build ready for deployment!" 