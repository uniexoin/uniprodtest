const fs = require('fs');

let content = fs.readFileSync('src/components/dashboard.tsx', 'utf8');

// Ensure VehicleCard is imported
if (!content.includes('import { VehicleCard }')) {
    content = content.replace(
        "import { AirbnbListingCard } from '@/components/airbnb-listing-card';",
        "import { AirbnbListingCard } from '@/components/airbnb-listing-card';\nimport { VehicleCard } from '@/components/vehicle-card';"
    );
}

const experiencesBlock = `
              {activeCategory === 'experiences' && (
                <div className="flex flex-col gap-6 w-full max-w-md mx-auto sm:max-w-none">
                  {/* Top Brands Filter */}
                  <div className="mb-2">
                    <h2 className="text-xl font-bold text-foreground tracking-tight mb-4 px-4 sm:px-8 md:px-12 lg:px-16">Top Brands</h2>
                    <div className="flex gap-4 overflow-x-auto pb-4 px-4 sm:px-8 md:px-12 lg:px-16 snap-x snap-mandatory scrollbar-hide">
                      {[
                        { name: 'All', icon: '/brands/all.png' },
                        { name: 'Royal Enfield', icon: '/brands/royal.png' },
                        { name: 'Honda', icon: '/brands/honda.png' },
                        { name: 'Yamaha', icon: '/brands/yamaha.png' },
                        { name: 'TATA', icon: '/brands/tata.png' }
                      ].map((brand, i) => (
                        <div key={brand.name} className="flex flex-col items-center gap-2 snap-center shrink-0 w-16">
                          <div className={\`w-14 h-14 rounded-full flex items-center justify-center \${i===0 ? 'bg-zinc-100 border-2 border-zinc-300' : 'bg-white border border-zinc-200 shadow-sm'}\`}>
                            {i === 0 ? <LayoutGrid className="w-5 h-5 text-zinc-600" /> : <img src={\`https://ui-avatars.com/api/?name=\${brand.name.charAt(0)}&background=random\`} alt={brand.name} className="w-8 h-8 object-contain rounded-full" />}
                          </div>
                          <span className="text-[10px] font-semibold text-center leading-tight">{brand.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Section title="Best Deals" showArrow={false}>
                    {isLoadingVehicles ? (
                      [1, 2].map(i => <div key={i} className="w-[280px] h-[300px] bg-slate-100 dark:bg-zinc-800 rounded-[1.2rem] animate-pulse shrink-0" />)
                    ) : vehicles.slice(0, 4).map((vehicle: any) => (
                      <VehicleCard
                        key={vehicle._id}
                        id={vehicle._id}
                        title={vehicle.name || vehicle.modelName || 'Vehicle'}
                        images={vehicle.images?.length ? vehicle.images : ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc']}
                        pricePerDay={vehicle.pricePerDay || 1000}
                        rating={4.8}
                        seatingCapacity={vehicle.seatingCapacity || 2}
                        fuelType={vehicle.fuelType || 'Petrol'}
                        kmsOrSpeed={vehicle.topSpeed || 349}
                        isAvailable={vehicle.isAvailable}
                        href={\`/vehicles/\${vehicle._id}\`}
                      />
                    ))}
                  </Section>

                  <Section title="Top Vehicles" showArrow={false}>
                    {isLoadingVehicles ? (
                      [1, 2].map(i => <div key={i} className="w-[280px] h-[300px] bg-slate-100 dark:bg-zinc-800 rounded-[1.2rem] animate-pulse shrink-0" />)
                    ) : vehicles.slice(0, 4).map((vehicle: any) => (
                      <VehicleCard
                        key={vehicle._id}
                        id={vehicle._id}
                        title={vehicle.name || vehicle.modelName || 'Vehicle'}
                        images={vehicle.images?.length ? vehicle.images : ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc']}
                        pricePerDay={vehicle.pricePerDay || 1000}
                        rating={5.0}
                        seatingCapacity={vehicle.seatingCapacity || 2}
                        fuelType={vehicle.fuelType || 'Petrol'}
                        kmsOrSpeed={vehicle.topSpeed || 349}
                        isAvailable={vehicle.isAvailable}
                        href={\`/vehicles/\${vehicle._id}\`}
                      />
                    ))}
                  </Section>

                  <Section title="Near Available" showArrow={false}>
                    {isLoadingVehicles ? (
                      [1, 2].map(i => <div key={i} className="w-[280px] h-[300px] bg-slate-100 dark:bg-zinc-800 rounded-[1.2rem] animate-pulse shrink-0" />)
                    ) : vehicles.slice(0, 4).map((vehicle: any) => (
                      <VehicleCard
                        key={vehicle._id}
                        id={vehicle._id}
                        title={vehicle.name || vehicle.modelName || 'Vehicle'}
                        images={vehicle.images?.length ? vehicle.images : ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc']}
                        pricePerDay={vehicle.pricePerDay || 1000}
                        rating={4.5}
                        seatingCapacity={vehicle.seatingCapacity || 2}
                        fuelType={vehicle.fuelType || 'Petrol'}
                        kmsOrSpeed={vehicle.topSpeed || 349}
                        isAvailable={vehicle.isAvailable}
                        href={\`/vehicles/\${vehicle._id}\`}
                      />
                    ))}
                  </Section>
                </div>
              )}
`;

// Insert after the homes block
const searchTarget = '</>\n              )}';
const replacement = '</>\n              )}\n' + experiencesBlock;

content = content.replace(searchTarget, replacement);

fs.writeFileSync('src/components/dashboard.tsx', content);
