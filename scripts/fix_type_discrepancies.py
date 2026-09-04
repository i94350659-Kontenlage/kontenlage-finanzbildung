import pathlib

src = pathlib.Path(r"G:\Scratch´nTravel\AusbauÜberlegungen\Website analysis and badge creation\src")

# 1. Fix Home.tsx
home_file = src / "pages" / "Home.tsx"
home_content = home_file.read_text(encoding="utf-8")
home_content = home_content.replace(
    """          <ScratchCard
            id={999}
            width={360}
            height={180}
            coverColor="#C9A84C"
            coverText="HIER RUBBELN"
            onScratched={() => setScratched(true)}
          >""",
    """          <ScratchCard
            cardId={999}
            width={360}
            height={180}
            onComplete={() => setScratched(true)}
          >"""
)
home_file.write_text(home_content, encoding="utf-8")
print("Home.tsx fixed")

# 2. Fix Tours.tsx
tours_file = src / "pages" / "Tours.tsx"
tours_content = tours_file.read_text(encoding="utf-8")
tours_content = tours_content.replace(
    """          const t: CommunityTour = {
            id: Date.now(),
            title: spot.title,
            creator: 'Du (Community)',
            avatar: 'YOU',
            distance: 'variabel',
            duration: 'variabel',
            elevation: 'variabel',
            difficulty: spot.difficulty,
            bestTime: 'Anytime',
            stops: 1,
            likes: 0,
            category: spot.category,
            tags: [spot.category],
            image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&h=400&fit=crop&auto=format',
            rating: 5.0,
            reviews: 1,
            dogFriendly: spot.dogFriendly,
            dogDetails: spot.dogNotes,
            strollerFriendly: spot.strollerFriendly,
            strollerDetails: spot.strollerNotes,
            familyKidsFriendly: spot.familyFriendly,
          }""",
    """          const t: CommunityTour = {
            id: Date.now(),
            title: spot.title,
            creator: 'Du (Community)',
            avatar: 'YOU',
            location: spot.location || 'Community Spot',
            country: 'Global',
            countryFlag: '🌍',
            distance: 'variabel',
            duration: 'variabel',
            elevation: 'variabel',
            difficulty: spot.difficulty,
            bestTime: 'Anytime',
            stops: 1,
            likes: 0,
            category: spot.category,
            tags: [spot.category],
            image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&h=400&fit=crop&auto=format',
            rating: 5.0,
            reviews: 1,
            dogFriendly: spot.dogFriendly,
            dogDetails: spot.dogNotes,
            strollerFriendly: spot.strollerFriendly,
            strollerDetails: spot.strollerNotes,
            familyKidsFriendly: spot.familyFriendly,
          }"""
)
tours_file.write_text(tours_content, encoding="utf-8")
print("Tours.tsx fixed")

# 3. Fix WanderBond.tsx
wb_file = src / "pages" / "WanderBond.tsx"
wb_content = wb_file.read_text(encoding="utf-8")
wb_content = wb_content.replace("buddy.verified", "buddy.verifiedLocal")
wb_content = wb_content.replace("buddy.travelStyle", "buddy.favoriteTour")
wb_content = wb_content.replace("activeBuddyModal.travelStyle", "activeBuddyModal.favoriteTour")
wb_file.write_text(wb_content, encoding="utf-8")
print("WanderBond.tsx fixed")
