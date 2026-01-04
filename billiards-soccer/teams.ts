export interface Team {
  id: string;
  name: string;
  primaryColor: string;
  type: 'country' | 'club';
  league?: 'Premier League' | 'La Liga' | 'Serie A' | 'Bundesliga' | 'Ligue 1' | 'Cosmic League';
}

export const TEAMS: Team[] = [
  // Countries
  { id: 'argentina', name: 'Argentina', primaryColor: '#75AADB', type: 'country' },
  { id: 'brazil', name: 'Brazil', primaryColor: '#F7DD00', type: 'country' },
  { id: 'england', name: 'England', primaryColor: '#FFFFFF', type: 'country' },
  { id: 'france', name: 'France', primaryColor: '#0055A4', type: 'country' },
  { id: 'germany', name: 'Germany', primaryColor: '#000000', type: 'country' },
  { id: 'italy', name: 'Italy', primaryColor: '#008C45', type: 'country' },
  { id: 'netherlands', name: 'Netherlands', primaryColor: '#F37021', type: 'country' },
  { id: 'portugal', name: 'Portugal', primaryColor: '#DA291C', type: 'country' },
  { id: 'spain', name: 'Spain', primaryColor: '#AA151B', type: 'country' },
  
  // Premier League
  { id: 'arsenal', name: 'Arsenal', primaryColor: '#EF0107', type: 'club', league: 'Premier League' },
  { id: 'chelsea', name: 'Chelsea', primaryColor: '#034694', type: 'club', league: 'Premier League' },
  { id: 'liverpool', name: 'Liverpool', primaryColor: '#C8102E', type: 'club', league: 'Premier League' },
  { id: 'man-city', name: 'Manchester City', primaryColor: '#6CABDD', type: 'club', league: 'Premier League' },
  { id: 'man-utd', name: 'Manchester United', primaryColor: '#DA291C', type: 'club', league: 'Premier League' },

  // La Liga
  { id: 'atletico', name: 'Atlético Madrid', primaryColor: '#CB3524', type: 'club', league: 'La Liga' },
  { id: 'barcelona', name: 'FC Barcelona', primaryColor: '#A50044', type: 'club', league: 'La Liga' },
  { id: 'real-madrid', name: 'Real Madrid', primaryColor: '#FEBE10', type: 'club', league: 'La Liga' },

  // Serie A
  { id: 'ac-milan', name: 'AC Milan', primaryColor: '#FB090B', type: 'club', league: 'Serie A' },
  { id: 'inter-milan', name: 'Inter Milan', primaryColor: '#010E80', type: 'club', league: 'Serie A' },
  { id: 'juventus', name: 'Juventus', primaryColor: '#000000', type: 'club', league: 'Serie A' },

  // Bundesliga
  { id: 'bayern', name: 'Bayern Munich', primaryColor: '#DC052D', type: 'club', league: 'Bundesliga' },
  { id: 'dortmund', name: 'Borussia Dortmund', primaryColor: '#FDE100', type: 'club', league: 'Bundesliga' },

  // Ligue 1
  { id: 'psg', name: 'Paris Saint-Germain', primaryColor: '#004171', type: 'club', league: 'Ligue 1' },

  // Cosmic League
  { id: 'sun-wukong-elite', name: '孙悟空精英队', primaryColor: '#F9A825', type: 'club', league: 'Cosmic League' },
  { id: 'bean-paste-bun', name: '豆沙包队', primaryColor: '#8C2B2B', type: 'club', league: 'Cosmic League' },
  { id: 'longze-sports', name: '龙泽体育', primaryColor: '#8E44AD', type: 'club', league: 'Cosmic League' },
  { id: 'dragon-city-joy', name: '龙城喜悦', primaryColor: '#E67E22', type: 'club', league: 'Cosmic League' },
  { id: 'super-seoul', name: '超级首尔', primaryColor: '#1ABC9C', type: 'club', league: 'Cosmic League' },
  { id: 'oriental-club', name: '东方俱乐部', primaryColor: '#34495E', type: 'club', league: 'Cosmic League' },
];