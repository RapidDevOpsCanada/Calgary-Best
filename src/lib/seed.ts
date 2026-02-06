export const SEED_SQL = `
-- Drop tables if they exist (for re-seeding)
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;

-- Categories
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT
);

-- Articles
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  image_url TEXT NOT NULL DEFAULT '',
  category_id INTEGER REFERENCES categories(id),
  author VARCHAR(200) DEFAULT 'Editorial Staff',
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  shares_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  read_time VARCHAR(20) DEFAULT '5 min read',
  badge VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Comments
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
  author_name VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Newsletter subscribers
CREATE TABLE newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(500) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP DEFAULT NOW()
);

-- Seed categories
INSERT INTO categories (name, slug, description) VALUES
  ('Culture', 'culture', 'Art, music, festivals and the cultural pulse of Calgary'),
  ('Food + Drink', 'food-drink', 'The best restaurants, bars, cafes and food experiences in Calgary'),
  ('City Life', 'city-life', 'Real estate, neighbourhoods, urban development and daily life'),
  ('Nightlife', 'nightlife', 'Clubs, bars, events and the after-dark scene'),
  ('Hidden Gems', 'hidden-gems', 'Secret spots and under-the-radar discoveries across the city'),
  ('Lifestyle', 'lifestyle', 'Wellness, fitness, shopping and everyday Calgary living');

-- Seed articles
INSERT INTO articles (title, slug, excerpt, content, image_url, category_id, author, is_featured, shares_count, views_count, read_time, badge) VALUES
(
  '10 Places You Won''t Believe Are Actually in Calgary!',
  '10-places-you-wont-believe-are-actually-in-calgary',
  'Discover the hidden architectural wonders and natural escapes that make YYC feel like a world-class destination. You don''t need a passport for these views.',
  '<p>Calgary is full of surprises. Beyond the skyline of glass towers and the sprawling suburbs, there are places that feel like they belong in another country entirely. From hidden valleys to architectural masterpieces, here are 10 spots that will make you see your city in a whole new light.</p>

<h2>1. Prince''s Island Park</h2>
<p>Nestled in the heart of downtown, this urban oasis on the Bow River feels like Central Park meets a European riverside promenade. In summer, the park comes alive with festivals, joggers, and picnickers enjoying the stunning mountain backdrop.</p>

<h2>2. The Peace Bridge</h2>
<p>Santiago Calatrava''s iconic helical bridge is a feat of engineering and art. Its bold red tubes twisting over the Bow River create a visual spectacle that wouldn''t look out of place in Barcelona or Dubai. Best photographed at golden hour.</p>

<h2>3. Studio Bell at the National Music Centre</h2>
<p>This metallic, vessel-shaped building in the East Village is an architectural marvel. Designed by Allied Works Architecture, it houses five floors of music history and interactive exhibits that celebrate Canada''s musical heritage.</p>

<h2>4. Fish Creek Provincial Park</h2>
<p>One of the largest urban parks in North America, Fish Creek stretches across the southern edge of the city. With over 80 km of pathways winding through forests, wetlands, and along the Bow River, it''s easy to forget you''re in a city of over a million people.</p>

<h2>5. The Simmons Building</h2>
<p>This beautifully restored 1912 warehouse in the East Village now houses some of Calgary''s best food and drink establishments. The industrial-chic aesthetic with exposed brick and massive timber beams gives it a Brooklyn or Shoreditch vibe.</p>

<h2>6. Nose Hill Park</h2>
<p>Standing atop Nose Hill on a clear day, with the entire city spread below you and the Rocky Mountains painting the western horizon, you''ll understand why early settlers chose this spot. The vast grasslands and big sky create a prairie sublime.</p>

<h2>7. Stephen Avenue Walk</h2>
<p>Calgary''s pedestrian mall is lined with heritage sandstone buildings dating back to the late 1800s. The tree-lined walkway, patios, and street performers create an atmosphere reminiscent of European city centres.</p>

<h2>8. The Bow Tower</h2>
<p>Norman Foster''s crescent-shaped skyscraper is one of the most striking pieces of modern architecture in North America. Its curved glass facade and suspended garden Sky Court on the 34th floor make it a must-see landmark.</p>

<h2>9. Kensington Village</h2>
<p>This bohemian neighbourhood across the Bow River from downtown feels like a small town within the city. Independent bookshops, eclectic cafes, vintage stores, and tree-lined streets give it an irresistible charm.</p>

<h2>10. Big Rock Erratic</h2>
<p>This 16,500-tonne quartzite boulder was deposited by glaciers during the last ice age, over 18,000 years ago. Sitting in an open field south of the city, it''s a surreal natural monument that reminds you of the powerful forces that shaped this landscape.</p>

<p>Calgary''s beauty lies in its contrasts: the ultra-modern alongside the historic, the wild next to the urban. Next time someone tells you there''s nothing to see here, send them this list.</p>',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBBpyfV36-zXrmzWrjhwOtT_d-M02xPre25rQUCnaNrWbVEmBOmeK_nj8aHo8MWuyHDbfB_bb3025OvZrNTQ7CzQ0IwT-0iScI0AuRRF5BCvXqYBkDSPTsWG3REFQgytK25L7KOpHCy71tlwRy8uMwh9mfONn3xfuMg9sqj9MbLgAxgw4xBiZls-9vfyfQXI5Sria914LDjd8oEA81ibU9QtuI1npXoX2r4zIHc-Y1H4Ffjof7r_EUFtmT2sxjKRl9TNQrZxAiy67hF',
  3, 'Editorial Staff', true, 24000, 156000, '8 min read', 'Feature Story'
),
(
  'Is This the Best Burger in YYC? We Tasted Everything to Find Out',
  'best-burger-in-yyc',
  'We spent three weeks eating our way through Calgary''s burger scene to crown the ultimate champion. Spoiler: it wasn''t who you''d expect.',
  '<p>The quest for the perfect burger is a noble one. And in a city as food-obsessed as Calgary, it''s also an incredibly delicious one. Over three weeks, our team visited 47 burger joints across the city, from dive bars to fine dining, food trucks to fast casual. Here''s what we found.</p>

<h2>The Criteria</h2>
<p>Every burger was judged on five factors: patty quality, bun integrity, toppings harmony, value for money, and the all-important "first bite factor." That moment when everything comes together and you know you''re eating something special.</p>

<h2>The Contenders</h2>
<p>We narrowed the field down to five finalists from across the city. From Kensington''s beloved institutions to Inglewood''s new-wave kitchens, every corner of Calgary had a champion to put forward.</p>

<h2>The Winner</h2>
<p>After much deliberation (and a lot of napkins), the crown goes to a spot you might walk right past. Tucked into a strip mall in the northeast, this family-run joint serves a smash burger that rivals anything in North America. The secret? House-ground beef, a proprietary seasoning blend, and a buttered potato bun that''s toasted to absolute perfection.</p>

<p>We''ll be revealing the full rankings and detailed reviews in our upcoming print edition. Stay tuned, Calgary. The burger wars are just getting started.</p>',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBGNOAjCp4pdovvhZtb6K207xV249IWbfbXbzJR0PKOO5QF9kAp4gpSBt20mouKueZVLkbctzd03Y1MLMa1GC7K9cjpvzPWhsjGyJH92ezmp1XVO5oUrF4Rw05B_xZxfdxPTrw4A63Jg0er3uPLXB_E8loNpx3bquOXDDPNi-yHsGLxoY1Dg-uPdRGQnLKL6OtOCzfBPcdwijiciHXgOEVhr-pI6PFIj6rZQcqwFPvbgALjRNdJxZZFJQ0zC-mehKx1lXBDc4FPvJQP',
  2, 'Editorial Staff', false, 12000, 89000, '6 min read', 'Foodie Alert'
),
(
  'Why Everyone is Moving to the East Village in 2024',
  'why-everyone-is-moving-to-east-village',
  'Real estate is booming and the vibes are unmatched. Here''s why the riverfront district is taking over Calgary''s social map.',
  '<p>Five years ago, Calgary''s East Village was a patchwork of empty lots and faded warehouses. Today, it''s the most talked-about neighbourhood in the city. With stunning riverfront condos, world-class dining, and a cultural scene that rivals anything in Canada, the East Village has completed one of the most remarkable urban transformations in recent memory.</p>

<h2>The Numbers Don''t Lie</h2>
<p>Property values in the East Village have increased by 34% over the past two years. Rental demand has surged, with vacancy rates dropping below 1%. Young professionals, families, and retirees alike are all drawn to the walkable, amenity-rich lifestyle.</p>

<h2>The Culture Factor</h2>
<p>Studio Bell, the Central Library, and the RiverWalk have created a cultural corridor unlike anything else in Western Canada. Add in the weekly farmers market, pop-up galleries, and year-round festivals, and you have a neighbourhood that''s as vibrant as it is livable.</p>

<h2>What''s Next</h2>
<p>With several major developments still in the pipeline — including a new waterfront park and mixed-use towers — the East Village story is far from over. The question isn''t whether to move here. It''s whether you can still afford to wait.</p>',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCD4tLiYwBTq1Hqe8nmLa3WrotMhV7LNRIP40Nt1LlYPqbNcBOXn40KvFjuGtQpLpesDIMdiq1m3ulcbcfBmAZ2c1Xxv4VcX7LG9WQ62RN-1yy_RmptW6TtyT00skWRKIoNKYSxTwb4bU2j1XjrPvmMPa2J3Jv45CtiRlYEv-pzBAFAUwxDduckQ6ymSKmdQpIKbGTWXPQIoIa6UIZZk4YFKvn-ck5i8Sp5Qo_5AG0JBwQ5BumgcKkgeA4LxlloyIoxuvbiYQAGga51',
  3, 'Editorial Staff', false, 8500, 67000, '7 min read', NULL
),
(
  'The Secret Rooftop Bar You Didn''t Know Existed',
  'secret-rooftop-bar',
  'Above the noise of 17th Avenue, a hidden door leads to one of Calgary''s most stunning cocktail experiences.',
  '<p>There''s no sign outside. No bouncer, no line. Just an unmarked door next to a dry cleaner on 17th Avenue SW. But step through, climb three flights of stairs, and you''ll emerge onto one of the most breathtaking rooftop bars in Western Canada.</p>

<h2>The Space</h2>
<p>The rooftop holds maybe 60 people at capacity. String lights criss-cross overhead, and the Calgary Tower glows in the distance. The seating is a mix of reclaimed wood tables and plush lounge areas, all surrounded by lush container gardens that the bar''s mixologist uses for fresh garnishes.</p>

<h2>The Drinks</h2>
<p>The cocktail menu rotates seasonally, but expect bold, inventive combinations. Think smoked rosemary old fashioneds, lavender gin fizzes, and a signature Calgary Sunset made with local rhubarb and Alberta honey. Everything is crafted with precision and theatricality.</p>

<h2>How to Get In</h2>
<p>The bar operates on a reservation-only basis, with bookings opening each Monday at noon for the following week. Spots fill within minutes. Our advice? Set an alarm, be quick on the draw, and prepare for an evening you won''t forget.</p>',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBfef6vKSZMAiJwLPFNRQ2v8DVPLLaaXWsg8HzEk3kDMOnLCLyW80UcMgl6rI9xvvSdxR8dl9KBnFbpuvYQawSW11toQJ79QQkaSQheSE9XtA6VSw7_CZmSY8uCAWsjw1_AhAr_yajn0pG49Lbj7xeyrN5Vw4ZIiBUV8aZCUvtba7Ep_YjQd9v1BqXTim-rN29-TJBIOytYRYP6YGLrsze3EBPDhkiuGhKHerzbv2ciqnZ5mfTnipgBzwcj1So4wXRLi22rhDE3TLpb',
  5, 'Editorial Staff', false, 18000, 112000, '4 min read', NULL
),
(
  'Calgary''s Best Kept Coffee Secrets Revealed by Locals',
  'calgarys-best-kept-coffee-secrets',
  'Forget the big chains. These are the specialty coffee shops that locals swear by — and most visitors never find.',
  '<p>Calgary''s coffee culture has quietly become one of the best in Western Canada. While visitors flock to the obvious chains, locals know that the real magic happens in tucked-away roasteries, converted garages, and unassuming storefronts across the city.</p>

<h2>The Roaster''s Lab — Ramsay</h2>
<p>In a converted mechanics garage in Ramsay, a former chemist has built one of the most precise roasting operations in the country. Every bean is profiled using custom software, and the pour-over bar offers a tasting experience that rivals any specialty shop in Vancouver or Toronto.</p>

<h2>Morning Ritual — Bridgeland</h2>
<p>This tiny shop seats maybe 12 people, but what it lacks in space it makes up for in character. The owner sources directly from small farms in Ethiopia and Colombia, and the espresso is consistently world-class. The cardamom latte has a cult following.</p>

<h2>Grounds & Co — Inglewood</h2>
<p>Part coffee shop, part record store, part community hub. Grounds & Co has become the living room of Inglewood, hosting open mic nights, art shows, and coffee cupping sessions. Their cold brew on nitro is legendary.</p>

<h2>Wild Roast — Kensington</h2>
<p>The newest addition to Calgary''s specialty scene, Wild Roast focuses on experimental processing methods. Natural, honey, and anaerobic coffees from around the world, prepared with scientific precision. It''s coffee nerd paradise.</p>

<p>The next time you''re in Calgary, skip the drive-through and seek out these spots. Your taste buds will thank you.</p>',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC-Nt7aL77N6i4FRHWAxs1KzcG_grFZQ3cIH9QAz14-yXT0BOOMMSa--lq6izpaEPP8lxjlmrh2AZYLtsIpcyEKUzCx_o5CgkjtBNUtGou7BL2Vm5AUiiBE0MC0W8FDLVjlRasXPkOnul1RWRnQr4HYo0TWgS_NoVaPQIbsk7WeYUKkde-68vzyaXixlWbjWaegy4NQ-9FwKwn1liNf3cr1JkgH64W9zzmefExCH5rDSrZbqOSYS2mSWDss3-qmGf-wIkHwSuXZeniX',
  6, 'Editorial Staff', false, 9200, 54000, '3 min read', NULL
),
(
  'Viral: Local Artist Paints Entire Alleyway Over Weekend',
  'local-artist-paints-entire-alleyway',
  'Art is blooming where you least expect it. Step inside the transformation of one of Calgary''s forgotten corridors.',
  '<p>When muralist Jade Whitehorse pulled up to an alley behind Centre Street on a Friday morning, the 200-metre corridor was grey, crumbling, and largely ignored. By Sunday evening, it had become one of the most Instagrammed locations in the city.</p>

<h2>72 Hours of Creation</h2>
<p>Working almost non-stop over the weekend, Whitehorse and a team of five assistant painters transformed the alley into a vivid celebration of Indigenous stories and Calgary''s natural landscape. Sweeping depictions of the Rocky Mountains, the Bow River, and local wildlife cover every surface — walls, dumpster enclosures, even the pavement.</p>

<h2>The Viral Moment</h2>
<p>A time-lapse video posted to social media on Monday morning had 2 million views by Tuesday. Major outlets picked up the story, and by midweek, the alley had become a destination. Lines of visitors waited to walk through and photograph the transformation.</p>

<h2>A New Chapter for Urban Art</h2>
<p>The City of Calgary has since approached Whitehorse about additional projects, and a crowdfunding campaign to preserve and extend the mural has already exceeded its goal. It''s a reminder that art can transform not just spaces, but communities.</p>

<p>"I wanted people to see beauty in the places they usually walk past," Whitehorse told Calgary Best. "Every corner of this city has a story. I just wanted to help tell it."</p>',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAPQZvJ32mDrXGGm5qr0BxAIxuwtydhEtn__3w-bbfE0vSzbSQH60ZCTg2jlia_E-LT0y4E6JmYzj6rs4ItlEiyh7bF6Uq2erooAFRgGViQn4eAm6j5gYBNY_XHPtpfHT1M3HrlSJ_4zTT60UEKZXUyHP7FD69YcrbOExjdJgDRw2HjqyRpPw2dGfz5aFoanw3rXUDKoUL___wzMEOxro8o2-QmXYefMag4_kbdHYsamOOeJxDRwFgXTfCTJHi9FRWQxjUn80OhQSb0',
  1, 'Editorial Staff', false, 15000, 98000, '5 min read', 'Culture Spotlight'
),
(
  '5 New Festivals Announced for Summer',
  '5-new-festivals-announced-for-summer',
  'Calgary''s festival calendar just got a major upgrade. Here are the five new events that will define summer in the city.',
  '<p>Calgary''s summer festival scene is about to level up. Five brand-new events have been announced for the upcoming season, each promising unique experiences that celebrate different facets of the city''s diverse culture and creative energy.</p>

<h2>1. Bow River Blues & BBQ</h2>
<p>A three-day festival on the banks of the Bow River combining live blues performances with Alberta''s best BBQ pitmasters. Expect smoky ribs, cold drinks, and soulful sounds echoing across the water.</p>

<h2>2. NeonNights Digital Art Festival</h2>
<p>Transforming the East Village into an open-air digital gallery, NeonNights will feature projection mapping, interactive installations, and performances by digital artists from around the world. The festival runs for two weeks in July.</p>

<h2>3. YYC Street Food Rally</h2>
<p>Inspired by the famous night markets of Asia, this weekly Friday night event will bring together 50+ food vendors, live DJs, and cultural performances in a rotating series of Calgary neighbourhoods.</p>

<h2>4. Chinook Comedy Fest</h2>
<p>A week-long celebration of comedy featuring both established headliners and emerging Calgary talent. Venues across the city — from theatres to breweries — will host stand-up, improv, and sketch shows.</p>

<h2>5. Prairie Sounds Music Summit</h2>
<p>A four-day music industry conference and showcase highlighting independent artists from across the Prairies. Think SXSW, but with a distinctly Western Canadian flavour.</p>

<p>Tickets and full lineups will be announced in the coming weeks. Start planning your summer now — it''s going to be a big one.</p>',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBBpyfV36-zXrmzWrjhwOtT_d-M02xPre25rQUCnaNrWbVEmBOmeK_nj8aHo8MWuyHDbfB_bb3025OvZrNTQ7CzQ0IwT-0iScI0AuRRF5BCvXqYBkDSPTsWG3REFQgytK25L7KOpHCy71tlwRy8uMwh9mfONn3xfuMg9sqj9MbLgAxgw4xBiZls-9vfyfQXI5Sria914LDjd8oEA81ibU9QtuI1npXoX2r4zIHc-Y1H4Ffjof7r_EUFtmT2sxjKRl9TNQrZxAiy67hF',
  1, 'Editorial Staff', false, 7800, 43000, '4 min read', NULL
),
(
  'The Ultimate Guide to 17th Avenue Nightlife',
  'ultimate-guide-17th-avenue-nightlife',
  'From craft cocktail lounges to late-night dance floors, here''s everything you need to know about Calgary''s most famous strip.',
  '<p>Seventeenth Avenue SW — known simply as "17th Ave" or "The Red Mile" — is the beating heart of Calgary''s nightlife. Stretching from 14th Street to Macleod Trail, this vibrant strip has something for everyone, whether you''re after a quiet cocktail or a night of dancing until dawn.</p>

<h2>For the Cocktail Connoisseur</h2>
<p>Start your evening at one of the avenue''s craft cocktail bars. These intimate venues focus on seasonal menus, house-made syrups, and spirits from local Alberta distilleries. Dress smart casual and expect exceptional service.</p>

<h2>For the Live Music Lover</h2>
<p>Multiple venues along 17th Ave host live music throughout the week. From indie rock to jazz, country to electronic, there''s a show happening almost every night. Many venues have no cover charge on weeknights.</p>

<h2>For the Late-Night Crowd</h2>
<p>When the cocktail bars wind down, the clubs come alive. Several venues along the strip stay open until 2am, with DJs spinning everything from top 40 to house music. The energy peaks on Friday and Saturday nights, when the avenue becomes a non-stop party.</p>

<h2>Pro Tips</h2>
<p>Arrive early for the best tables. Many spots fill up by 9pm on weekends. Download the local transit app for easy rides home. And keep an eye on social media — pop-up events and surprise performances happen regularly along the strip.</p>',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBfef6vKSZMAiJwLPFNRQ2v8DVPLLaaXWsg8HzEk3kDMOnLCLyW80UcMgl6rI9xvvSdxR8dl9KBnFbpuvYQawSW11toQJ79QQkaSQheSE9XtA6VSw7_CZmSY8uCAWsjw1_AhAr_yajn0pG49Lbj7xeyrN5Vw4ZIiBUV8aZCUvtba7Ep_YjQd9v1BqXTim-rN29-TJBIOytYRYP6YGLrsze3EBPDhkiuGhKHerzbv2ciqnZ5mfTnipgBzwcj1So4wXRLi22rhDE3TLpb',
  4, 'Editorial Staff', false, 11000, 72000, '5 min read', NULL
);

-- Seed some comments
INSERT INTO comments (article_id, author_name, content) VALUES
  (1, 'Sarah M.', 'The Peace Bridge at sunset is absolutely magical! Great list.'),
  (1, 'Mike T.', 'Can''t believe you didn''t include the Glenbow Museum!'),
  (1, 'Priya K.', 'Fish Creek is my favourite place in the whole city. So underrated.'),
  (2, 'BurgerFanatic', 'I think I know which strip mall spot you''re talking about... 👀'),
  (2, 'Jamie L.', 'This is the content I needed. My weekend plans are SET.'),
  (3, 'Rachel W.', 'Moved to East Village last year. Best decision ever.'),
  (4, 'CocktailKing', 'Finally someone wrote about this place! The lavender gin fizz is incredible.'),
  (6, 'ArtLover_YYC', 'Walked through this alley yesterday. The detail is unbelievable.'),
  (6, 'Downtown Dave', 'This is what Calgary needs more of. Art everywhere!');
`;
