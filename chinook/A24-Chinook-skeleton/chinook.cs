namespace chinook {
    using System;
    using static System .Console;
    using System .Collections .Generic;
    using System .IO;
    using System .Linq;
    using System .Linq .Dynamic .Core;
    using System .Text .Json;
    using System .Threading .Tasks;
    using Microsoft .EntityFrameworkCore;
    using chinook .Models;
    //using System.CodeDom.Compiler;
    
    class Chinook {     
        public IQueryable Type(ChinookContext db,string st){
            switch (st)
            {
                case "Albums":
                    return db.Albums;
                case "Artists":
                    return db.Artists;
                case "Customers":
                    return db.Customers;
                case "Employees":
                    return db.Employees;
                case "Genres":
                    return db.Genres;
                case "InvoiceItems":
                    return db.InvoiceItems;
                case "Invoices":
                    return db.Invoices;
                case "MediaTypes":
                    return db.MediaTypes;
                case "PlaylistTrack":
                    return db.PlaylistTrack;
                case "Playlists":
                    return db.Playlists;
                case "Tracks":
                    return db.Tracks;
                default:
                    return db.Albums;
            }

        }  
       
            public IQueryable first(IQueryable seq, string st, string st2){
                switch (st)
                {
                    case "Select":
                        return seq.Select(st2);
                    case "Where":
                        return seq.Where(st2);
                    case "OrderBy":
                        return seq.OrderBy(st2);
                    default:
                        return seq.Select(st2);
                }
            }  
            public IQueryable first(IQueryable seq, string st, int st2){
                switch (st)
                {
                    case "Skip":
                        return seq.Skip(st2);
                    case "Take":
                        return seq.Take(st2);
                    default:
                        return seq.Skip(st2);
                }
            }  
       
        public string Main2 (ChinookContext db, TextReader inp) {
            string data = inp.ReadLine();
            var seq = Type(db, data);
            
            data = inp.ReadLine();
            var strings = data.Split(new[] { ' ' }, 2);
            IQueryable seq2;
            if(strings[0].Contains("Take") || strings[0].Contains("Skip")){
                seq2 = first(seq, strings[0], int.Parse(strings[1]));
            }else{
                seq2 = first(seq, strings[0], strings[1]);
            }
            while((data = inp.ReadLine()) != null)  
            {   
                strings = data.Split(new[] { ' ' }, 2);
                if(strings[0].Contains("Take") || strings[0].Contains("Skip")){
                    seq2 = first(seq2, strings[0], int.Parse(strings[1]));
                }else{
                    seq2 = first(seq2, strings[0], strings[1]);
                }
            }
            return JsonSerializer.Serialize (seq2 .AsEnumerable () .ToList ());
            


            /*
            var seq3 = db.Artists
                .OrderBy ("Name DESC")
                .Where ("ArtistId % 10 == 0")
                .Take (3)
                .Select ("new (ArtistId, Name)");
            */
            //return JsonSerializer.Serialize (seq2 .AsEnumerable () .ToList ());
        }        


        static void Main (string[] args) {
            try {
                //WriteLine ($"{System.IO.Directory.GetCurrentDirectory()}");
                var db = new ChinookContext ();
                var json = new Chinook (). Main2 (db, Console.In);
                WriteLine ($"{json}");
                
            } catch (Exception ex) {
                WriteLine ($"*** {ex.Message}");
            }
        }
    }
}

namespace chinook .Models {
    public partial class ChinookConStr {
        public static string ConStr = 
            @"Data Source=chinook.db;Mode=ReadOnly";
    }
}

namespace chinook .Models {
    using System;
    using Microsoft .EntityFrameworkCore;
    using Microsoft .EntityFrameworkCore .Metadata;

    public partial class ChinookContext : DbContext {
        public ChinookContext () {
        }

        public ChinookContext (DbContextOptions<ChinookContext> options)
            : base (options) {
        }

        public virtual DbSet<Albums> Albums { get; set; }
        public virtual DbSet<Artists> Artists { get; set; }
        public virtual DbSet<Customers> Customers { get; set; }
        public virtual DbSet<Employees> Employees { get; set; }
        public virtual DbSet<Genres> Genres { get; set; }
        public virtual DbSet<InvoiceItems> InvoiceItems { get; set; }
        public virtual DbSet<Invoices> Invoices { get; set; }
        public virtual DbSet<MediaTypes> MediaTypes { get; set; }
        public virtual DbSet<PlaylistTrack> PlaylistTrack { get; set; }
        public virtual DbSet<Playlists> Playlists { get; set; }
        public virtual DbSet<Tracks> Tracks { get; set; }

        protected override void OnConfiguring (DbContextOptionsBuilder optionsBuilder) {
            if (!optionsBuilder .IsConfigured) {
                optionsBuilder .UseSqlite (ChinookConStr.ConStr);
            }
        }

        protected override void OnModelCreating (ModelBuilder modelBuilder) {
            modelBuilder.Entity<Albums> (entity => {
                entity.HasKey (e => e.AlbumId);

                entity.ToTable ("albums");

                entity.HasIndex (e => e.ArtistId)
                    .HasName ("IFK_AlbumArtistId");

                entity.Property (e => e.AlbumId).ValueGeneratedNever ();

                entity.Property (e => e.Title)
                    .IsRequired ()
                    .HasColumnType ("NVARCHAR(160)");

                entity.HasOne (d => d.Artist)
                    .WithMany (p => p.Albums)
                    .HasForeignKey (d => d.ArtistId)
                    .OnDelete (DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<Artists> (entity => {
                entity.HasKey (e => e.ArtistId);

                entity.ToTable ("artists");

                entity.Property (e => e.ArtistId).ValueGeneratedNever ();

                entity.Property (e => e.Name).HasColumnType ("NVARCHAR(120)");
            });

            modelBuilder.Entity<Customers> (entity => {
                entity.HasKey (e => e.CustomerId);

                entity.ToTable ("customers");

                entity.HasIndex (e => e.SupportRepId)
                    .HasName ("IFK_CustomerSupportRepId");

                entity.Property (e => e.CustomerId).ValueGeneratedNever ();

                entity.Property (e => e.Address).HasColumnType ("NVARCHAR(70)");

                entity.Property (e => e.City).HasColumnType ("NVARCHAR(40)");

                entity.Property (e => e.Company).HasColumnType ("NVARCHAR(80)");

                entity.Property (e => e.Country).HasColumnType ("NVARCHAR(40)");

                entity.Property (e => e.Email)
                    .IsRequired ()
                    .HasColumnType ("NVARCHAR(60)");

                entity.Property (e => e.Fax).HasColumnType ("NVARCHAR(24)");

                entity.Property (e => e.FirstName)
                    .IsRequired ()
                    .HasColumnType ("NVARCHAR(40)");

                entity.Property (e => e.LastName)
                    .IsRequired ()
                    .HasColumnType ("NVARCHAR(20)");

                entity.Property (e => e.Phone).HasColumnType ("NVARCHAR(24)");

                entity.Property (e => e.PostalCode).HasColumnType ("NVARCHAR(10)");

                entity.Property (e => e.State).HasColumnType ("NVARCHAR(40)");

                entity.HasOne (d => d.SupportRep)
                    .WithMany (p => p.Customers)
                    .HasForeignKey (d => d.SupportRepId);
            });

            modelBuilder.Entity<Employees> (entity => {
                entity.HasKey (e => e.EmployeeId);

                entity.ToTable ("employees");

                entity.HasIndex (e => e.ReportsTo)
                    .HasName ("IFK_EmployeeReportsTo");

                entity.Property (e => e.EmployeeId).ValueGeneratedNever ();

                entity.Property (e => e.Address).HasColumnType ("NVARCHAR(70)");

                entity.Property (e => e.BirthDate).HasColumnType ("DATETIME");

                entity.Property (e => e.City).HasColumnType ("NVARCHAR(40)");

                entity.Property (e => e.Country).HasColumnType ("NVARCHAR(40)");

                entity.Property (e => e.Email).HasColumnType ("NVARCHAR(60)");

                entity.Property (e => e.Fax).HasColumnType ("NVARCHAR(24)");

                entity.Property (e => e.FirstName)
                    .IsRequired ()
                    .HasColumnType ("NVARCHAR(20)");

                entity.Property (e => e.HireDate).HasColumnType ("DATETIME");

                entity.Property (e => e.LastName)
                    .IsRequired ()
                    .HasColumnType ("NVARCHAR(20)");

                entity.Property (e => e.Phone).HasColumnType ("NVARCHAR(24)");

                entity.Property (e => e.PostalCode).HasColumnType ("NVARCHAR(10)");

                entity.Property (e => e.State).HasColumnType ("NVARCHAR(40)");

                entity.Property (e => e.Title).HasColumnType ("NVARCHAR(30)");

                entity.HasOne (d => d.ReportsToNavigation)
                    .WithMany (p => p.InverseReportsToNavigation)
                    .HasForeignKey (d => d.ReportsTo);
            });

            modelBuilder.Entity<Genres> (entity => {
                entity.HasKey (e => e.GenreId);

                entity.ToTable ("genres");

                entity.Property (e => e.GenreId).ValueGeneratedNever ();

                entity.Property (e => e.Name).HasColumnType ("NVARCHAR(120)");
            });

            modelBuilder.Entity<InvoiceItems> (entity => {
                entity.HasKey (e => e.InvoiceLineId);

                entity.ToTable ("invoice_items");

                entity.HasIndex (e => e.InvoiceId)
                    .HasName ("IFK_InvoiceLineInvoiceId");

                entity.HasIndex (e => e.TrackId)
                    .HasName ("IFK_InvoiceLineTrackId");

                entity.Property (e => e.InvoiceLineId).ValueGeneratedNever ();

                entity.Property (e => e.UnitPrice)
                    .IsRequired ()
                    .HasColumnType ("NUMERIC(10,2)");

                entity.HasOne (d => d.Invoice)
                    .WithMany (p => p.InvoiceItems)
                    .HasForeignKey (d => d.InvoiceId)
                    .OnDelete (DeleteBehavior.ClientSetNull);

                entity.HasOne (d => d.Track)
                    .WithMany (p => p.InvoiceItems)
                    .HasForeignKey (d => d.TrackId)
                    .OnDelete (DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<Invoices> (entity => {
                entity.HasKey (e => e.InvoiceId);

                entity.ToTable ("invoices");

                entity.HasIndex (e => e.CustomerId)
                    .HasName ("IFK_InvoiceCustomerId");

                entity.Property (e => e.InvoiceId).ValueGeneratedNever ();

                entity.Property (e => e.BillingAddress).HasColumnType ("NVARCHAR(70)");

                entity.Property (e => e.BillingCity).HasColumnType ("NVARCHAR(40)");

                entity.Property (e => e.BillingCountry).HasColumnType ("NVARCHAR(40)");

                entity.Property (e => e.BillingPostalCode).HasColumnType ("NVARCHAR(10)");

                entity.Property (e => e.BillingState).HasColumnType ("NVARCHAR(40)");

                entity.Property (e => e.InvoiceDate)
                    .IsRequired ()
                    .HasColumnType ("DATETIME");

                entity.Property (e => e.Total)
                    .IsRequired ()
                    .HasColumnType ("NUMERIC(10,2)");

                entity.HasOne (d => d.Customer)
                    .WithMany (p => p.Invoices)
                    .HasForeignKey (d => d.CustomerId)
                    .OnDelete (DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<MediaTypes> (entity => {
                entity.HasKey (e => e.MediaTypeId);

                entity.ToTable ("media_types");

                entity.Property (e => e.MediaTypeId).ValueGeneratedNever ();

                entity.Property (e => e.Name).HasColumnType ("NVARCHAR(120)");
            });

            modelBuilder.Entity<PlaylistTrack> (entity => {
                entity.HasKey (e => new { e.PlaylistId, e.TrackId });

                entity.ToTable ("playlist_track");

                entity.HasIndex (e => e.TrackId)
                    .HasName ("IFK_PlaylistTrackTrackId");

                entity.HasOne (d => d.Playlist)
                    .WithMany (p => p.PlaylistTrack)
                    .HasForeignKey (d => d.PlaylistId)
                    .OnDelete (DeleteBehavior.ClientSetNull);

                entity.HasOne (d => d.Track)
                    .WithMany (p => p.PlaylistTrack)
                    .HasForeignKey (d => d.TrackId)
                    .OnDelete (DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<Playlists> (entity => {
                entity.HasKey (e => e.PlaylistId);

                entity.ToTable ("playlists");

                entity.Property (e => e.PlaylistId).ValueGeneratedNever ();

                entity.Property (e => e.Name).HasColumnType ("NVARCHAR(120)");
            });

            modelBuilder.Entity<Tracks> (entity => {
                entity.HasKey (e => e.TrackId);

                entity.ToTable ("tracks");

                entity.HasIndex (e => e.AlbumId)
                    .HasName ("IFK_TrackAlbumId");

                entity.HasIndex (e => e.GenreId)
                    .HasName ("IFK_TrackGenreId");

                entity.HasIndex (e => e.MediaTypeId)
                    .HasName ("IFK_TrackMediaTypeId");

                entity.Property (e => e.TrackId).ValueGeneratedNever ();

                entity.Property (e => e.Composer).HasColumnType ("NVARCHAR(220)");

                entity.Property (e => e.Name)
                    .IsRequired ()
                    .HasColumnType ("NVARCHAR(200)");

                entity.Property (e => e.UnitPrice)
                    .IsRequired ()
                    .HasColumnType ("NUMERIC(10,2)");

                entity.HasOne (d => d.Album)
                    .WithMany (p => p.Tracks)
                    .HasForeignKey (d => d.AlbumId);

                entity.HasOne (d => d.Genre)
                    .WithMany (p => p.Tracks)
                    .HasForeignKey (d => d.GenreId);

                entity.HasOne (d => d.MediaType)
                    .WithMany (p => p.Tracks)
                    .HasForeignKey (d => d.MediaTypeId)
                    .OnDelete (DeleteBehavior.ClientSetNull);
            });

            OnModelCreatingPartial (modelBuilder);
        }

        partial void OnModelCreatingPartial (ModelBuilder modelBuilder);
    }
}

namespace chinook.Models {
    using System;
    using System.Collections.Generic;

    public partial class Albums {
        public Albums () {
            Tracks = new HashSet<Tracks> ();
        }

        public long AlbumId { get; set; }
        public string Title { get; set; }
        public long ArtistId { get; set; }

        public virtual Artists Artist { get; set; }
        public virtual ICollection<Tracks> Tracks { get; set; }
    }

    public partial class Artists {
        public Artists () {
            Albums = new HashSet<Albums> ();
        }

        public long ArtistId { get; set; }
        public string Name { get; set; }

        public virtual ICollection<Albums> Albums { get; set; }
    }

    public partial class Customers {
        public Customers () {
            Invoices = new HashSet<Invoices> ();
        }

        public long CustomerId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Company { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string PostalCode { get; set; }
        public string Phone { get; set; }
        public string Fax { get; set; }
        public string Email { get; set; }
        public long? SupportRepId { get; set; }

        public virtual Employees SupportRep { get; set; }
        public virtual ICollection<Invoices> Invoices { get; set; }
    }

    public partial class Employees {
        public Employees () {
            Customers = new HashSet<Customers> ();
            InverseReportsToNavigation = new HashSet<Employees> ();
        }

        public long EmployeeId { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string Title { get; set; }
        public long? ReportsTo { get; set; }
        public byte[] BirthDate { get; set; }
        public byte[] HireDate { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string PostalCode { get; set; }
        public string Phone { get; set; }
        public string Fax { get; set; }
        public string Email { get; set; }

        public virtual Employees ReportsToNavigation { get; set; }
        public virtual ICollection<Customers> Customers { get; set; }
        public virtual ICollection<Employees> InverseReportsToNavigation { get; set; }
    }

    public partial class Genres {
        public Genres () {
            Tracks = new HashSet<Tracks> ();
        }

        public long GenreId { get; set; }
        public string Name { get; set; }

        public virtual ICollection<Tracks> Tracks { get; set; }
    }

    public partial class InvoiceItems {
        public long InvoiceLineId { get; set; }
        public long InvoiceId { get; set; }
        public long TrackId { get; set; }
        public byte[] UnitPrice { get; set; }
        public long Quantity { get; set; }

        public virtual Invoices Invoice { get; set; }
        public virtual Tracks Track { get; set; }
    }

    public partial class Invoices {
        public Invoices () {
            InvoiceItems = new HashSet<InvoiceItems> ();
        }

        public long InvoiceId { get; set; }
        public long CustomerId { get; set; }
        public byte[] InvoiceDate { get; set; }
        public string BillingAddress { get; set; }
        public string BillingCity { get; set; }
        public string BillingState { get; set; }
        public string BillingCountry { get; set; }
        public string BillingPostalCode { get; set; }
        public byte[] Total { get; set; }

        public virtual Customers Customer { get; set; }
        public virtual ICollection<InvoiceItems> InvoiceItems { get; set; }
    }

    public partial class MediaTypes {
        public MediaTypes () {
            Tracks = new HashSet<Tracks> ();
        }

        public long MediaTypeId { get; set; }
        public string Name { get; set; }

        public virtual ICollection<Tracks> Tracks { get; set; }
    }

    public partial class PlaylistTrack {
        public long PlaylistId { get; set; }
        public long TrackId { get; set; }

        public virtual Playlists Playlist { get; set; }
        public virtual Tracks Track { get; set; }
    }

    public partial class Playlists {
        public Playlists () {
            PlaylistTrack = new HashSet<PlaylistTrack> ();
        }

        public long PlaylistId { get; set; }
        public string Name { get; set; }

        public virtual ICollection<PlaylistTrack> PlaylistTrack { get; set; }
    }

    public partial class Tracks {
        public Tracks () {
            InvoiceItems = new HashSet<InvoiceItems> ();
            PlaylistTrack = new HashSet<PlaylistTrack> ();
        }

        public long TrackId { get; set; }
        public string Name { get; set; }
        public long? AlbumId { get; set; }
        public long MediaTypeId { get; set; }
        public long? GenreId { get; set; }
        public string Composer { get; set; }
        public long Milliseconds { get; set; }
        public long? Bytes { get; set; }
        public byte[] UnitPrice { get; set; }

        public virtual Albums Album { get; set; }
        public virtual Genres Genre { get; set; }
        public virtual MediaTypes MediaType { get; set; }
        public virtual ICollection<InvoiceItems> InvoiceItems { get; set; }
        public virtual ICollection<PlaylistTrack> PlaylistTrack { get; set; }
    }
}
