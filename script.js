document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('myChart').getContext('2d');
    
    const data2020 = [17, 2095, 5793, 8415, 8144, 3207, 15617, 8771];
    const labels = [
        'Agriculteurs exploitants',
        'Artisans, commerçants, chefs d\'entreprise',
        'Cadres et professions intellectuelles supérieures',
        'Professions intermédiaires',
        'Employés',
        'Ouvriers',
        'Retraités',
        'Autres personnes sans activité professionnelle'
    ];

    // Calculer le total pour les pourcentages
    const total = data2020.reduce((a, b) => a + b, 0);
    
    const data = {
        labels: labels,
        datasets: [{
            data: data2020,
            backgroundColor: [
                'rgba(0, 122, 255, 0.8)',    // iOS Blue
                'rgba(255, 59, 48, 0.8)',    // iOS Red
                'rgba(52, 199, 89, 0.8)',    // iOS Green
                'rgba(255, 149, 0, 0.8)',    // iOS Orange
                'rgba(175, 82, 222, 0.8)',   // iOS Purple
                'rgba(90, 200, 250, 0.8)',   // iOS Light Blue
                'rgba(255, 204, 0, 0.8)',    // iOS Yellow
                'rgba(88, 86, 214, 0.8)'     // iOS Indigo
            ],
            borderColor: 'white',
            borderWidth: 2
        }]
    };

    const config = {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: 50
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        },
        plugins: [{
            afterDraw: function(chart) {
                const ctx = chart.ctx;
                ctx.save();
                const centerX = chart.getDatasetMeta(0).data[0].x;
                const centerY = chart.getDatasetMeta(0).data[0].y;
                const radius = chart.getDatasetMeta(0).data[0].outerRadius;

                chart.data.datasets.forEach(function(dataset, i) {
                    const meta = chart.getDatasetMeta(i);
                    if (!meta.hidden) {
                        meta.data.forEach(function(element, index) {
                            const startAngle = element.startAngle;
                            const endAngle = element.endAngle;
                            const middleAngle = startAngle + (endAngle - startAngle) / 2;
                            const percentage = ((dataset.data[index] / total) * 100).toFixed(1);
                            const value = data2020[index].toLocaleString();

                            if (index === 0) { // Pour les agriculteurs
                                // Position plus éloignée du camembert (radius + 5 + 3% du radius)
                                const textRadius = radius + 5 + (radius * 0.03);
                                const textX = centerX + Math.cos(middleAngle) * textRadius;
                                const textY = centerY + Math.sin(middleAngle) * textRadius;

                                // Texte externe sur une seule ligne
                                ctx.fillStyle = 'black';
                                ctx.font = '12px Arial';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(`${labels[index]} : ${value} (${percentage}%)`, textX, textY);
                            } else {
                                // Pour tous les autres segments
                                const angle = startAngle + (endAngle - startAngle) / 2;
                                
                                // Position pour le nom de la catégorie (plus loin du bord)
                                const labelRadius = radius * 0.8;
                                const labelX = centerX + Math.cos(angle) * labelRadius;
                                const labelY = centerY + Math.sin(angle) * labelRadius;

                                // Position pour les valeurs (plus proche du centre)
                                const valueRadius = radius * 0.45;
                                const valueX = centerX + Math.cos(angle) * valueRadius;
                                const valueY = centerY + Math.sin(angle) * valueRadius;

                                // Dessiner le nom de la catégorie
                                ctx.fillStyle = 'black'; 
                                ctx.font = '11px Arial';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                
                                // Diviser le nom en mots pour l'afficher sur plusieurs lignes si nécessaire
                                const words = labels[index].split(' ');
                                const lineHeight = 12;
                                let y = labelY - ((words.length - 1) * lineHeight) / 2;
                                words.forEach(word => {
                                    ctx.fillText(word, labelX, y);
                                    y += lineHeight;
                                });

                                // Dessiner les valeurs
                                ctx.font = '12px Arial';
                                ctx.fillText(`${value}`, valueX, valueY - 6);
                                ctx.fillText(`${percentage}%`, valueX, valueY + 6);
                            }
                        });
                    }
                });
                ctx.restore();
            }
        }]
    };

    new Chart(ctx, config);
});
