'use client';

import * as React from 'react';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { calculateBMI, bmiCategory, projectWeightLoss } from '@/lib/validators';

export function ImcCalculator() {
  const [peso, setPeso] = React.useState(90);
  const [altura, setAltura] = React.useState(170);

  const imc = calculateBMI(peso, altura);
  const category = bmiCategory(imc);
  const projected = projectWeightLoss(peso);

  return (
    <section id="calculadora" className="bg-cream section-y">
      <div className="container">
        <div className="mx-auto max-w-3xl rounded-3xl bg-forest p-8 text-cream shadow-lg md:p-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold-200">
            Calculadora de IMC
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-balance">
            Quanto você pode perder em 12 meses?
          </h2>
          <p className="mt-3 text-cream/80">
            Ajuste seu peso e altura para ver uma estimativa baseada em estudos clínicos de GLP-1.
          </p>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div>
              <div className="mb-3 flex items-end justify-between">
                <label htmlFor="peso-slider" className="text-sm font-medium text-cream/90">
                  Peso atual
                </label>
                <span className="font-display text-2xl">{peso} kg</span>
              </div>
              <Slider
                id="peso-slider"
                value={[peso]}
                min={50}
                max={200}
                step={1}
                onValueChange={(v) => setPeso(v[0] ?? peso)}
                aria-label="Peso em quilogramas"
              />
            </div>
            <div>
              <div className="mb-3 flex items-end justify-between">
                <label htmlFor="altura-slider" className="text-sm font-medium text-cream/90">
                  Altura
                </label>
                <span className="font-display text-2xl">{altura} cm</span>
              </div>
              <Slider
                id="altura-slider"
                value={[altura]}
                min={140}
                max={220}
                step={1}
                onValueChange={(v) => setAltura(v[0] ?? altura)}
                aria-label="Altura em centímetros"
              />
            </div>
          </div>

          <div className="mt-10 grid gap-6 border-t border-cream/20 pt-8 md:grid-cols-2">
            <div>
              <p className="text-sm text-cream/70">Seu IMC</p>
              <p className="mt-1 font-display text-4xl">{imc.toFixed(1)}</p>
              <Badge variant="gold" className="mt-2">
                {category}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-cream/70">Perda estimada</p>
              <p className="mt-1 font-display text-4xl text-gold-200">
                <AnimatedNumber value={projected} decimals={1} suffix=" kg" />
              </p>
              <p className="mt-2 text-xs text-cream/70">em até 12 meses</p>
            </div>
          </div>

          <p className="mt-8 text-xs text-cream/60">
            Estimativa baseada em estudos clínicos de GLP-1 (perda média ~21% do peso corporal).
            Resultados variam de acordo com o paciente, adesão ao tratamento e estilo de vida.
            Não substitui avaliação médica.
          </p>
        </div>
      </div>
    </section>
  );
}
