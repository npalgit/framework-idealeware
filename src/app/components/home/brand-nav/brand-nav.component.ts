import { Component, OnInit } from '@angular/core';
import { PLATFORM_ID, Inject, Input } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Store } from '../../../models/store/store';
import { Brand } from '../../../models/brand/brand';
import { BrandService } from '../../../services/brand.service';
import { AppCore } from '../../../app.core';
import { Subscriber } from 'rxjs/Subscriber';

declare var $: any;

@Component({
    selector: 'app-brand-nav',
    templateUrl: '../../../template/home/brand-nav/brand-nav.html',
    styleUrls: ['../../../template/home/brand-nav/brand-nav.scss']
})
export class BrandNavComponent implements OnInit {
    @Input() store: Store = new Store();
    allBrands: Brand[] = [];
    brands: Brand[] = [];

    constructor(
        private service: BrandService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        this.service.getAll()
            .subscribe(brands => {
                this.allBrands = brands;
                this.removeBrandWithoutPicture();
            }, e => {
                console.log(e);
            });
    }

    ngAfterViewChecked() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.brands.length > 0 && $('.showcase-brands.slick-slider .slick-track').children('.slick-slide').length == 0) {
                $('.showcase-brands').slick({
                    infinite: true,
                    autoplay: true,
                    slidesToShow: 5,
                    slidesToScroll: 5
                });
            }
        }
    }

    private removeBrandWithoutPicture() {
        this.allBrands.forEach(brand => {
            if (brand.picture)
                this.brands.push(brand);
        });
    }

    getRoute(brand: Brand): string {
        return `/marcas/${brand.id}/${AppCore.getNiceName(brand.name)}`;
    }

    getPictureUrl(brand: Brand): string {
        return `${this.store.link}/static/brands/${brand.picture}`;
    }
}