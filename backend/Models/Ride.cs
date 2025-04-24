namespace backend.Models
{
    public class Ride
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Zone { get; set; }
        public ICollection<CrowdSnapshot> CrowdSnapshots { get; set; }
    }
}